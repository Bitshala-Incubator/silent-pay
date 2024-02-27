import { mnemonicToSeedSync } from 'bip39';
import { initEccLib, payments, Psbt, Transaction } from 'bitcoinjs-lib';
import BIP32Factory, { BIP32Interface } from 'bip32';
import * as ecc from 'tiny-secp256k1';
import { Buffer } from 'buffer';
import { fromOutputScript, toOutputScript } from 'bitcoinjs-lib/src/address';
import { ECPairFactory } from 'ecpair';
import { toXOnly } from 'bitcoinjs-lib/src/psbt/bip371';
import { encrypt, decrypt } from 'bip38';
import { createOutputs, encodeSilentPaymentAddress } from '@silent-pay/core';
import { NetworkInterface, DbInterface, Coin, CoinSelector } from './index.ts';

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
            const path = await this.db.getPathFromAddress(coins[index].address);
            const privateKey = this.masterKey.derivePath(path);
            psbt.signInput(index, privateKey);
        }
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
            psbt.addInput(coin.toInput(this.network.network));
        }

        await this.signTransaction(psbt, selectedCoins);

        if (
            !psbt.validateSignaturesOfAllInputs((pubkey, msghash, signature) =>
                ECPair.fromPublicKey(pubkey).verify(msghash, signature),
            )
        ) {
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
        const outpoints = selectedCoins.map((coin) => ({
            txid: coin.txid,
            vout: coin.vout,
        }));

        const [{ script: internalPubKey }] = createOutputs(
            privateKeys.map((key) => ({
                key: key.privateKey.toString('hex'),
                isXOnly: false,
            })),
            outpoints,
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
            psbt.addInput(selectedCoins[index].toInput(this.network.network));
            psbt.signInput(index, privateKeys[index]);
        }

        if (
            !psbt.validateSignaturesOfAllInputs((pubkey, msghash, signature) =>
                ECPair.fromPublicKey(pubkey).verify(msghash, signature),
            )
        ) {
            throw new Error('Invalid signature');
        }

        psbt.finalizeAllInputs();
        const tx = psbt.extractTransaction();
        await this.network.broadcast(tx.toHex());

        return tx.getId();
    }

    async generateSilentPaymentAddress(): Promise<string> {
        let address = await this.db.getSilentPaymentAddress();
        if (address) return address;

        const coinType = this.network.network.bech32 === 'bc' ? 0 : 1;
        const spendKey = this.masterKey.derivePath(
            `m/352'/${coinType}'/0'/0'/0`,
        );
        const scanKey = this.masterKey.derivePath(
            `m/352'/${coinType}'/0'/1'/0`,
        );

        address = encodeSilentPaymentAddress(
            scanKey.publicKey,
            spendKey.publicKey,
            this.network.network,
        );
        await this.db.saveSilentPaymentAddress(address);
        return address;
    }
}
