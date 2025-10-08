import { mnemonicToSeedSync } from 'bip39';
import { initEccLib, payments, Psbt, Transaction } from 'bitcoinjs-lib';
import BIP32Factory, { BIP32Interface } from 'bip32';
import * as ecc from 'tiny-secp256k1';
import { Buffer } from 'buffer';
import { fromOutputScript, toOutputScript } from 'bitcoinjs-lib/src/address';
import { ECPairFactory } from 'ecpair';
import { toXOnly } from 'bitcoinjs-lib/src/psbt/bip371';
import { encrypt, decrypt } from 'bip38';
import {
    createOutputs,
    encodeSilentPaymentAddress,
    SilentBlock,
    scanOutputsWithTweak,
} from '@silent-pay/core';
import { NetworkInterface, DbInterface, Coin, CoinSelector } from './index';
import { bitcoin } from 'bitcoinjs-lib/src/networks';

initEccLib(ecc);
const ECPair = ECPairFactory(ecc);
const bip32 = BIP32Factory(ecc);

export type WalletConfigOptions = {
    db: DbInterface;
    networkClient: NetworkInterface;
    lookahead?: number;
};

const DEFAULT_ENCRYPTION_PASSWORD = '12345678';
const DEFAULT_LOOKAHEAD = 10;

export class Wallet {
    private readonly db: DbInterface;
    private readonly network: NetworkInterface;
    private masterKey: BIP32Interface;
    private receiveDepth: number = 0;
    private changeDepth: number = 0;
    private lookahead: number;
    private spendKey: BIP32Interface;
    private scanKey: BIP32Interface;

    constructor(config: WalletConfigOptions) {
        this.db = config.db;
        this.network = config.networkClient;
        this.lookahead = config.lookahead ?? DEFAULT_LOOKAHEAD;
    }

    async init(params?: { mnemonic?: string; password?: string }) {
        const { mnemonic, password } = params;
        await this.db.open();

        if (mnemonic) {
            const seed = mnemonicToSeedSync(mnemonic).toString('hex');
            this.masterKey = bip32.fromSeed(Buffer.from(seed, 'hex'));
            this.setPassword(password ?? DEFAULT_ENCRYPTION_PASSWORD);
            for (let i = 0; i < this.lookahead; i++) {
                await this.deriveAddress(`m/84'/0'/0'/0/${i}`);
            }
        } else {
            const { encryptedPrivateKey, encryptedChainCode } =
                await this.db.getMasterKey();
            const { privateKey: decryptedPrivateKey } = decrypt(
                encryptedPrivateKey,
                password ?? DEFAULT_ENCRYPTION_PASSWORD,
            );
            const { privateKey: decryptedChainCode } = decrypt(
                encryptedChainCode,
                password ?? DEFAULT_ENCRYPTION_PASSWORD,
            );
            this.masterKey = bip32.fromPrivateKey(
                decryptedPrivateKey,
                decryptedChainCode,
            );
            this.spendKey = this.masterKey.derivePath(
                `m/352'/${this.getCoinType()}'/0'/0'/0`,
            );
            this.scanKey = this.masterKey.derivePath(
                `m/352'/${this.getCoinType()}'/0'/1'/0`,
            );
        }
    }

    async close() {
        await this.db.setReceiveDepth(this.receiveDepth);
        await this.db.setChangeDepth(this.changeDepth);

        await this.db.close();
    }

    async setPassword(newPassword: string) {
        if (!this.masterKey) {
            throw new Error('Wallet not initialized. Please call src.init()');
        } else {
            const encryptedPrivateKey = encrypt(
                this.masterKey.privateKey,
                false,
                newPassword,
            );
            const encryptedChainCode = encrypt(
                this.masterKey.chainCode,
                false,
                newPassword,
            );
            await this.db.setMasterKey(encryptedPrivateKey, encryptedChainCode);
        }
    }

    private async deriveAddress(path: string): Promise<string> {
        const child = this.masterKey.derivePath(path);
        const { address } = payments.p2wpkh({
            pubkey: child.publicKey,
            network: this.network.network,
        });

        await this.db.saveAddress(address, path);

        return address;
    }

    async deriveReceiveAddress(): Promise<string> {
        const nextPath = `m/84'/0'/0'/0/${this.receiveDepth + this.lookahead}`;
        await this.deriveAddress(nextPath);
        const address = await this.db.getAddressFromPath(
            `m/84'/0'/0'/0/${this.receiveDepth}`,
        );
        this.receiveDepth++;
        return address;
    }

    async deriveChangeAddress(): Promise<string> {
        const path = `m/84'/0'/0'/1/${this.changeDepth}`;
        const address = await this.deriveAddress(path);
        this.changeDepth++;
        return address;
    }

    async scan() {
        const addresses = await this.db.getAllAddresses();
        const coins = (
            await Promise.all(
                addresses.map((address) => this.network.getUTXOs(address)),
            )
        ).reduce((acc, utxos) => [...acc, ...utxos], []);

        await this.db.saveUnspentCoins(coins);
    }

    async getBalance(): Promise<number> {
        const coins = await this.db.getUnspentCoins();
        return coins.reduce((acc, coin) => acc + coin.value, 0);
    }

    private async signTransaction(psbt: Psbt, coins: Coin[]): Promise<void> {
        for (let index = 0; index < coins.length; index++) {
            const coin = coins[index];
            if (coin.tweak) {
                const spendPriv = this.spendKey.privateKey;
                const tweakBuf = Buffer.from(coin.tweak, 'hex');

                const ephemeralPriv = ecc.privateAdd(spendPriv, tweakBuf);

                const keyPair = ECPair.fromPrivateKey(
                    Buffer.from(ephemeralPriv),
                );
                const xPub = toXOnly(keyPair.publicKey);

                const schnorrSigner = {
                    publicKey: xPub,
                    sign: () => {
                        throw new Error('Taproot requires Schnorr');
                    },
                    signSchnorr: (msgHash: Buffer) =>
                        keyPair.signSchnorr(msgHash),
                };

                psbt.signInput(index, schnorrSigner);
            } else {
                const path = await this.db.getPathFromAddress(coin.address);
                const privateKey = this.masterKey.derivePath(path);
                psbt.signInput(index, privateKey);
            }
        }
    }

    private validateSignatures(psbt: Psbt): boolean {
        return psbt.validateSignaturesOfAllInputs(
            (pubkey, msghash, signature) => {
                if (pubkey.length === 32) {
                    return ecc.verifySchnorr(msghash, pubkey, signature);
                } else {
                    return ECPair.fromPublicKey(pubkey).verify(
                        msghash,
                        signature,
                    );
                }
            },
        );
    }

    async createAndSignTransaction(
        addresses: { address: string; amount: number }[],
    ): Promise<Transaction> {
        const totalAmount = addresses.reduce(
            (acc, address) => acc + address.amount,
            0,
        );
        const coins = await this.db.getUnspentCoins();
        const totalBalance = coins.reduce((acc, coin) => acc + coin.value, 0);

        if (totalAmount > totalBalance) {
            throw new Error(
                `Insufficient funds. Available: ${totalBalance} sats, Requested: ${totalAmount} sats`,
            );
        }

        const tx = new Transaction();
        const psbt = new Psbt({ network: this.network.network });
        addresses.forEach(({ address, amount }) => {
            tx.addOutput(toOutputScript(address, this.network.network), amount);
            psbt.addOutput({
                address,
                value: amount,
            });
        });

        const coinSelector = new CoinSelector(await this.network.getFeeRate());
        const { coins: selectedCoins, change } = coinSelector.select(coins, tx);
        if (change > 0) {
            const changeAddress = await this.deriveChangeAddress();
            psbt.addOutput({
                address: changeAddress,
                value: change,
            });
        }

        for (const coin of selectedCoins) {
            psbt.addInput(
                coin.toInput(this.network.network, this.spendKey.publicKey),
            );
        }

        await this.signTransaction(psbt, selectedCoins);

        if (!this.validateSignatures(psbt)) {
            throw new Error('Invalid signature');
        }

        psbt.finalizeAllInputs();

        return psbt.extractTransaction();
    }

    async send(address: string, amount: number): Promise<string> {
        const tx = await this.createAndSignTransaction([{ address, amount }]);
        await this.network.broadcast(tx.toHex());

        return tx.getId();
    }

    async sendToSilentAddress(
        address: string,
        amount: number,
    ): Promise<string> {
        const coins = await this.db.getUnspentCoins();
        const totalBalance = coins.reduce((acc, coin) => acc + coin.value, 0);

        if (amount > totalBalance) {
            throw new Error(
                `Insufficient funds. Available: ${totalBalance} sats, Requested: ${amount} sats`,
            );
        }

        // we need input private keys to derive silent payment address,
        // so we will use a dummy address for now and replace it later
        const dummyOutputScript = Buffer.from(
            '512030d54fd0dd420a6e5f8d3624f5f3482cae350f79d5f0753bf5beef9c2d91af3c',
            'hex',
        );

        const dummyTx = new Transaction();
        const dummyPsbt = new Psbt({ network: this.network.network });
        dummyTx.addOutput(dummyOutputScript, amount);
        dummyPsbt.addOutput({
            address: fromOutputScript(dummyOutputScript, this.network.network),
            value: amount,
        });

        const coinSelector = new CoinSelector(await this.network.getFeeRate());
        const { coins: selectedCoins, change } = coinSelector.select(
            coins,
            dummyTx,
        );

        const privateKeys = (
            await Promise.all(
                selectedCoins.map((coin) =>
                    this.db.getPathFromAddress(coin.address),
                ),
            )
        ).map((path) => this.masterKey.derivePath(path));

        // find the coin with smallest outpoint
        const smallestOutpointCoin = selectedCoins.reduce((acc, coin) => {
            const comp = Buffer.from(coin.txid, 'hex')
                .reverse()
                .compare(Buffer.from(acc.txid, 'hex').reverse());
            if (comp < 0 || (comp === 0 && coin.vout < acc.vout)) return coin;
            return acc;
        }, selectedCoins[0]);

        const [{ script: internalPubKey }] = createOutputs(
            privateKeys.map((key) => ({
                key: key.privateKey.toString('hex'),
                isXOnly: false,
            })),
            {
                txid: smallestOutpointCoin.txid,
                vout: smallestOutpointCoin.vout,
            },
            [{ address, amount }],
            this.network.network,
        );

        const psbt = new Psbt({ network: this.network.network });
        psbt.addOutput({
            address: payments.p2tr({
                pubkey: toXOnly(internalPubKey),
                network: this.network.network,
            }).address,
            value: amount,
        });

        if (change > 0) {
            const changeAddress = await this.deriveChangeAddress();
            psbt.addOutput({
                address: changeAddress,
                value: change,
            });
        }

        for (let index = 0; index < selectedCoins.length; index++) {
            psbt.addInput(
                selectedCoins[index].toInput(
                    this.network.network,
                    this.spendKey.publicKey,
                ),
            );
            psbt.signInput(index, privateKeys[index]);
        }

        if (!this.validateSignatures(psbt)) {
            throw new Error('Invalid signature');
        }

        psbt.finalizeAllInputs();
        const tx = psbt.extractTransaction();
        await this.network.broadcast(tx.toHex());

        return tx.getId();
    }

    getCoinType(): number {
        return this.network.network.bech32 === bitcoin.bech32 ? 0 : 1;
    }

    async generateSilentPaymentAddress(): Promise<string> {
        let address = await this.db.getSilentPaymentAddress();
        if (address) return address;

        address = encodeSilentPaymentAddress(
            this.scanKey.publicKey,
            this.spendKey.publicKey,
            this.network.network,
        );
        await this.db.saveSilentPaymentAddress(address);
        return address;
    }

    private matchSilentBlockOutputs(
        silentBlock: SilentBlock,
        scanPrivateKey: Buffer,
        spendPublicKey: Buffer,
    ): Coin[] {
        const matchedUTXOs: Coin[] = [];

        for (const transaction of silentBlock.transactions) {
            const outputs = transaction.outputs;

            if (outputs.length === 0) continue;

            const outputPubKeys = outputs.map((output) =>
                Buffer.from('02' + output.pubKey, 'hex'),
            );

            const scanTweak = Buffer.from(transaction.scanTweak, 'hex');

            const matchedOutputs = scanOutputsWithTweak(
                scanPrivateKey,
                spendPublicKey,
                scanTweak,
                outputPubKeys,
            );

            if (matchedOutputs.size === 0) continue;

            for (const pubKeyHex of matchedOutputs.keys()) {
                const output = outputs.find(
                    (output) => output.pubKey === pubKeyHex.slice(2),
                );
                if (output) {
                    matchedUTXOs.push(
                        new Coin({
                            txid: transaction.txid,
                            vout: output.vout,
                            value: output.value,
                            address: payments.p2tr({
                                pubkey: toXOnly(
                                    Buffer.from('02' + output.pubKey, 'hex'),
                                ),
                                network: this.network.network,
                            }).address,
                            status: {
                                isConfirmed: true,
                            },
                            tweak: matchedOutputs
                                .get(pubKeyHex)
                                ?.toString('hex'),
                        }),
                    );
                }
            }
        }

        return matchedUTXOs;
    }

    async scanSilentBlock(silentBlock: SilentBlock): Promise<void> {
        const matchedUTXOs = this.matchSilentBlockOutputs(
            silentBlock,
            this.scanKey.privateKey,
            this.spendKey.publicKey,
        );

        if (matchedUTXOs.length) {
            await this.db.saveUnspentCoins(matchedUTXOs);
        }
    }
}
