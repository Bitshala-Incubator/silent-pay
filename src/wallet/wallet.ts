import { DbInterface } from './db';
import { NetworkInterface } from './network';
import { mnemonicToSeedSync } from 'bip39';
import { payments } from 'bitcoinjs-lib';
import BIP32Factory from 'bip32';
import * as ecc from 'tiny-secp256k1';

const bip32 = BIP32Factory(ecc);

export type WalletConfigOptions = {
    db: DbInterface;
    networkClient: NetworkInterface;
};

export class Wallet {
    private readonly db: DbInterface;
    private readonly network: NetworkInterface;
    private seed: string;
    private receiveDepth: number = 0;
    private changeDepth: number = 0;

    constructor(config: WalletConfigOptions) {
        this.db = config.db;
        this.network = config.networkClient;
        this.seed = mnemonicToSeedSync(
            'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
        ).toString('hex');
    }

    async init() {
        await this.db.open();
    }

    async close() {
        await this.db.setReceiveDepth(this.receiveDepth);
        await this.db.setChangeDepth(this.changeDepth);

        await this.db.close();
    }

    async load(mnemonic?: string) {
        if (mnemonic) {
            this.seed = mnemonicToSeedSync(mnemonic).toString('hex');
            await this.db.setSeed(this.seed);
        } else {
            this.seed = await this.db.getSeed();
        }
    }

    private deriveAddress(path: string): string {
        const master = bip32.fromSeed(Buffer.from(this.seed, 'hex'));
        const child = master.derivePath(path);
        const { address } = payments.p2wpkh({
            pubkey: child.publicKey,
            network: this.network.network,
        });

        return address!;
    }

    async deriveReceiveAddress(): Promise<string> {
        const path = `m/84'/0'/0'/0/${this.receiveDepth}`;
        const address = this.deriveAddress(path);
        await this.db.saveAddress(address, path);
        this.receiveDepth++;
        return address;
    }

    async deriveChangeAddress(): Promise<string> {
        const path = `m/84'/0'/0'/1/${this.changeDepth}`;
        const address = this.deriveAddress(path);
        await this.db.saveAddress(address, path);
        this.changeDepth++;
        return address;
    }
}
