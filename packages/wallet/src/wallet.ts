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
import { NetworkInterface, DbInterface, Coin, CoinSelector, isP2Silent, P2Silent } from './index.ts';
import secp256k1 from 'secp256k1';


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
    private scanKey: BIP32Interface;
    private spendKey: BIP32Interface;

    constructor(config: WalletConfigOptions) {
        this.db = config.db;
        this.network = config.networkClient;
        this.lookahead = config.lookahead ?? DEFAULT_LOOKAHEAD;
    }

    async init(params?: { mnemonic?: string; password?: string }) {
        const { mnemonic, password } = params ?? {}; // Ensure params is not undefined
        await this.db.open();
    
        if (mnemonic) {
            await this.initializeWithMnemonic(mnemonic, password);
        } else {
            await this.initializeFromStoredKey(password);
        }
    }
    
    private async initializeWithMnemonic(mnemonic: string, password?: string) {
        const seed = mnemonicToSeedSync(mnemonic).toString('hex');
        this.masterKey = bip32.fromSeed(Buffer.from(seed, 'hex'));
        const coinType = this.network.network.bech32 === 'bc' ? 0 : 1;
        this.scanKey = this.masterKey.derivePath(`m/352'/${coinType}'/0'/1'/0`);
        this.spendKey = this.masterKey.derivePath(`m/352'/${coinType}'/0'/0'/0`);

        this.setPassword(password ?? DEFAULT_ENCRYPTION_PASSWORD);
    
        for (let i = 0; i < this.lookahead; i++) {
            await this.deriveP2WPKHAddress(`m/84'/0'/0'/0/${i}`);
        }
    }
    
    private async initializeFromStoredKey(password?: string) {
        const { encryptedPrivateKey, encryptedChainCode } = await this.db.getMasterKey();
    
        const decryptedPrivateKey = decrypt(
            encryptedPrivateKey,
            password ?? DEFAULT_ENCRYPTION_PASSWORD
        ).privateKey;
    
        const decryptedChainCode = decrypt(
            encryptedChainCode,
            password ?? DEFAULT_ENCRYPTION_PASSWORD
        ).privateKey;
    
        this.masterKey = bip32.fromPrivateKey(decryptedPrivateKey, decryptedChainCode);
        const coinType = this.network.network.bech32 === 'bc' ? 0 : 1;
        this.scanKey = this.masterKey.derivePath(`m/352'/${coinType}'/0'/1'/0`);
        this.spendKey = this.masterKey.derivePath(`m/352'/${coinType}'/0'/0'/0`);
    }
    

    async close() {
        await this.db.setReceiveDepth(this.receiveDepth);
        await this.db.setChangeDepth(this.changeDepth);

        await this.db.close();
    }

    async setPassword(newPassword: string) {
        if (!this.masterKey || !this.masterKey.privateKey) {
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

    private async deriveP2WPKHAddress(path: string): Promise<string> {
        const child = this.masterKey.derivePath(path);
        const { address } = payments.p2wpkh({
            pubkey: child.publicKey,
            network: this.network.network,
        });

        if (!address) {
            throw new Error("Cannot derive P2WPKH Address")
        }

        await this.db.saveAddress(address, path);

        return address;
    }



    async deriveP2WPKHReceiveAddress(): Promise<string> {
        const nextPath = `m/84'/0'/0'/0/${this.receiveDepth + this.lookahead}`;
        await this.deriveP2WPKHAddress(nextPath);
        const address = await this.db.getAddressFromPath(
            `m/84'/0'/0'/0/${this.receiveDepth}`,
        );
        this.receiveDepth++;
        return address;
    }

    async deriveP2WPKHChangeAddress(): Promise<string> {
        const path = `m/84'/0'/0'/1/${this.changeDepth}`;
        const address = await this.deriveP2WPKHAddress(path);
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

    private async signP2WPKHTransactionInputs(psbt: Psbt, coins: Coin[]): Promise<void> {
        for (let index = 0; index < coins.length; index++) {
            const path = await this.db.getPathFromAddress(coins[index].address);
            const privateKey = this.masterKey.derivePath(path);
            psbt.signInput(index, privateKey);
        }
    }
    
    
    private async signSilentPaymentTransactionInputs(psbt: Psbt, coins: P2Silent[]): Promise<void> {
        const spendPrivateKey = this.spendKey.privateKey;
        if (!spendPrivateKey) {
            throw new Error('Spend key not initialized');
        }
    
        for (let index = 0; index < coins.length; index++) {
            const coin = coins[index];
            const tweakedKey = secp256k1.privateKeyTweakAdd(
                Uint8Array.from(spendPrivateKey),
                Uint8Array.from(coin.tweakedData)
            );
        
            const privateKey = bip32.fromPrivateKey(
                Buffer.from(tweakedKey),
                Buffer.alloc(32),
                this.network.network
            );
        
            psbt.signTaprootInput(index, privateKey);
        }
    }

    private async getCoinsToSpend(amount: number) {
        let coins = await this.db.getUnspentSilentPaymentCoins();
        let balance = coins.reduce((acc, coin) => acc + coin.value, 0);

        if (balance < amount) {
            coins = await this.db.getUnspentSilentPaymentCoins();
            balance = coins.reduce((acc, coin) => acc + coin.value, 0);
        }

        if (balance < amount) {
            throw new Error(
                `Insufficient funds. Available: ${balance} sats, Requested: ${amount} sats`,
            );
        }
        return coins
    }

    async createAndSignTransaction(
        addresses: { address: string; amount: number }[],
    ): Promise<Transaction> {
        const totalAmount = addresses.reduce(
            (acc, address) => acc + address.amount,
            0,
        );

        const coins = await this.getCoinsToSpend(totalAmount);
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
            const changeAddress = await this.deriveP2WPKHChangeAddress();
            psbt.addOutput({
                address: changeAddress,
                value: change,
            });
        }

        for (const coin of selectedCoins) {
            psbt.addInput(coin.toInput(this.network.network));
        }

        if (isP2Silent(selectedCoins)) {
            await this.signSilentPaymentTransactionInputs(psbt, selectedCoins);
        } else {
            await this.signP2WPKHTransactionInputs(psbt, selectedCoins);
        }
        

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

        // find the coin with smallest outpoint
        const smallestOutpointCoin = selectedCoins.reduce((acc, coin) => {
            const comp = Buffer.from(coin.txid, 'hex')
                .reverse()
                .compare(Buffer.from(acc.txid, 'hex').reverse());
            if (comp < 0 || (comp === 0 && coin.vout < acc.vout)) return coin;
            return acc;
        }, selectedCoins[0]);

        const mappedKeys = privateKeys.map((key, index) => {
            if (!key.privateKey) {
                throw new Error(`Private key is undefined for entry at index ${index}`);
            }
            return {
                key: key.privateKey.toString('hex'),
                isXOnly: false,
            };
        });

        const [{ script: internalPubKey }] = createOutputs(
            mappedKeys,
            {
                txid: smallestOutpointCoin.txid,
                vout: smallestOutpointCoin.vout,
            },
            [{ address, amount }],
            this.network.network,
        );

        const psbt = new Psbt({ network: this.network.network });
        const p2trPayment = payments.p2tr({
            pubkey: toXOnly(internalPubKey),
            network: this.network.network,
        }).address;

        if (!p2trPayment) {
            throw new Error('Cannot create P2TR payment');
        }

        psbt.addOutput({
            address: p2trPayment,
            value: amount,
        });

        if (change > 0) {
            const changeAddress = await this.deriveP2WPKHChangeAddress();
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


