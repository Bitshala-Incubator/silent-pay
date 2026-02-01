import * as fs from 'fs';
import { mnemonicToSeedSync } from 'bip39';
import BIP32Factory from 'bip32';
import * as ecc from 'tiny-secp256k1';
import { payments } from 'bitcoinjs-lib';
import { regtest } from 'bitcoinjs-lib/src/networks';
import { Buffer } from 'buffer';
import { Wallet } from '../src';
import { WalletDB } from '@silent-pay/level/src';
import { Coin, NetworkInterface } from '../src';

const bip32 = BIP32Factory(ecc);

class MockNetworkClient implements NetworkInterface {
    constructor(private readonly usedAddresses: Set<string>) {}

    get network() {
        return regtest;
    }

    async getLatestBlockHeight(): Promise<number> {
        return 0;
    }

    async getLatestBlockHash(): Promise<string> {
        return '0'.repeat(64);
    }

    async getBlockHash(_height: number): Promise<string> {
        return '0'.repeat(64);
    }

    async getUTXOs(address: string): Promise<Coin[]> {
        if (this.usedAddresses.has(address)) {
            return [
                new Coin({
                    txid: '0'.repeat(64),
                    vout: 0,
                    value: 1000,
                    address,
                    status: { isConfirmed: true },
                }),
            ];
        }
        return [];
    }

    async getFeeRate(): Promise<number> {
        return 1;
    }

    async broadcast(_tx: string): Promise<void> {
        return;
    }
}

describe('Wallet address discovery', () => {
    const mnemonic =
        'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
    const walletPath = './test/wallet-discovery';

    const deriveAddress = (index: number, change: 0 | 1) => {
        const seed = mnemonicToSeedSync(mnemonic).toString('hex');
        const masterKey = bip32.fromSeed(Buffer.from(seed, 'hex'));
        const child = masterKey.derivePath(`m/84'/0'/0'/${change}/${index}`);
        return payments.p2wpkh({
            pubkey: child.publicKey,
            network: regtest,
        }).address!;
    };

    it('should discover used addresses and persist depths', async () => {
        const usedAddresses = new Set<string>([
            deriveAddress(0, 0),
            deriveAddress(2, 0),
            deriveAddress(1, 1),
        ]);

        const walletDB = new WalletDB({ location: walletPath });
        const wallet = new Wallet({
            db: walletDB,
            networkClient: new MockNetworkClient(usedAddresses),
            gapLimit: 2,
        });

        await wallet.init({ mnemonic });

        expect(await walletDB.getReceiveDepth()).toBe(3);
        expect(await walletDB.getChangeDepth()).toBe(2);

        await wallet.close();
        fs.rmSync(walletPath, { recursive: true, force: true });
    });
});
