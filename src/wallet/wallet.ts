import { DbInterface } from './db';
import { NetworkInterface } from './network';
import { mnemonicToSeedSync } from 'bip39';
import { payments } from 'bitcoinjs-lib';
import BIP32Factory, { BIP32Interface } from 'bip32';
import * as ecc from 'tiny-secp256k1';
import { Buffer } from 'buffer';

const bip32 = BIP32Factory(ecc);

export type WalletConfigOptions = {
    db: DbInterface;
    networkClient: NetworkInterface;
};

export class Wallet {
    private readonly db: DbInterface;
    private readonly network: NetworkInterface;
    private masterKey: BIP32Interface;
    private receiveDepth: number = 0;
    private changeDepth: number = 0;

    constructor(config: WalletConfigOptions) {
        this.db = config.db;
        this.network = config.networkClient;
    }

    async init(mnemonic?: string) {
        await this.db.open();

        if (mnemonic) {
            const seed = mnemonicToSeedSync(mnemonic).toString('hex');
            this.masterKey = bip32.fromSeed(Buffer.from(seed, 'hex'));
            await this.db.setMasterKey(
                this.masterKey.privateKey,
                this.masterKey.chainCode,
            );
        } else {
            const { privateKey, chaincode } = await this.db.getMasterKey();
            this.masterKey = bip32.fromPrivateKey(privateKey, chaincode);
        }
    }

    async close() {
        await this.db.setReceiveDepth(this.receiveDepth);
        await this.db.setChangeDepth(this.changeDepth);

        await this.db.close();
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
        const path = `m/84'/0'/0'/0/${this.receiveDepth}`;
        const address = await this.deriveAddress(path);
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
}
