import { Wallet } from '../src/wallet';
import { DbInterface } from '../src/db.interface';
import { NetworkInterface } from '../src/network.interface';
import { Coin } from '../src/coin';
import { networks, Network, Psbt } from 'bitcoinjs-lib';
import { parsedSilentBlock } from './helpers/silent-block.fixtures';
import { SilentBlock } from '@silent-pay/core';

jest.mock('bip38', () => ({
    encrypt: jest.fn((key: Buffer) => '6P' + Buffer.from(key).toString('hex')),
    decrypt: jest.fn((encrypted: string) => ({
        privateKey: Buffer.from(encrypted.slice(2), 'hex'),
        compressed: true,
    })),
}));

class MockDb implements DbInterface {
    private addresses = new Map<string, string>();
    private paths = new Map<string, string>();
    private masterKeyData: {
        encryptedPrivateKey: string;
        encryptedChainCode: string;
    } | null = null;
    private receiveDepth = 0;
    private changeDepth = 0;
    private unspentCoins: Coin[] = [];
    private spAddress?: string;
    private version = 1;
    public status = 'closed';

    async open(): Promise<void> {
        this.status = 'open';
    }
    async close(): Promise<void> {
        this.status = 'closed';
    }
    getStatus(): string {
        return this.status;
    }
    async getVersion(): Promise<number> {
        return this.version;
    }
    async setVersion(v: number): Promise<void> {
        this.version = v;
    }
    async getMasterKey(): Promise<{
        encryptedPrivateKey: string;
        encryptedChainCode: string;
    }> {
        if (!this.masterKeyData) throw new Error('No master key');
        return this.masterKeyData;
    }
    async setMasterKey(
        encryptedPrivateKey: string,
        encryptedChainCode: string,
    ): Promise<void> {
        this.masterKeyData = { encryptedPrivateKey, encryptedChainCode };
    }
    async saveAddress(address: string, path: string): Promise<void> {
        this.addresses.set(address, path);
        this.paths.set(path, address);
    }
    async getPathFromAddress(address: string): Promise<string> {
        const p = this.addresses.get(address);
        if (!p) throw new Error(`Path not found for address ${address}`);
        return p;
    }
    async getAddressFromPath(path: string): Promise<string> {
        const a = this.paths.get(path);
        if (!a) throw new Error(`Address not found for path ${path}`);
        return a;
    }
    async hasAddress(address: string): Promise<boolean> {
        return this.addresses.has(address);
    }
    async getReceiveDepth(): Promise<number> {
        return this.receiveDepth;
    }
    async setReceiveDepth(depth: number): Promise<void> {
        this.receiveDepth = depth;
    }
    async getChangeDepth(): Promise<number> {
        return this.changeDepth;
    }
    async setChangeDepth(depth: number): Promise<void> {
        this.changeDepth = depth;
    }
    async getAllAddresses(): Promise<string[]> {
        return Array.from(this.addresses.keys());
    }
    async saveUnspentCoins(coins: Coin[]): Promise<void> {
        this.unspentCoins = coins;
    }
    async getUnspentCoins(): Promise<Coin[]> {
        return this.unspentCoins;
    }
    async saveSilentPaymentAddress(address: string): Promise<void> {
        this.spAddress = address;
    }
    async getSilentPaymentAddress(): Promise<string> {
        return this.spAddress!;
    }
}

class MockNetwork implements NetworkInterface {
    network: Network = networks.regtest;
    feeRate = 10;
    utxosByAddress = new Map<string, Coin[]>();
    broadcastedTxs: string[] = [];

    async getLatestBlockHeight(): Promise<number> {
        return 100;
    }
    async getLatestBlockHash(): Promise<string> {
        return '00'.repeat(32);
    }
    async getBlockHash(height: number): Promise<string> {
        void height;
        return '00'.repeat(32);
    }
    async getFeeRate(): Promise<number> {
        return this.feeRate;
    }
    async getUTXOs(address: string): Promise<Coin[]> {
        return this.utxosByAddress.get(address) || [];
    }
    async broadcast(txHex: string): Promise<void> {
        this.broadcastedTxs.push(txHex);
    }
}

describe('Wallet transaction lifecycle and signing', () => {
    const testMnemonic =
        'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
    let db: MockDb;
    let network: MockNetwork;
    let wallet: Wallet;

    beforeEach(() => {
        db = new MockDb();
        network = new MockNetwork();
        wallet = new Wallet({
            db,
            networkClient: network,
            lookahead: 5,
        });
    });

    async function initWallet() {
        await wallet.init({
            mnemonic: testMnemonic,
            password: 'testPassword',
        });
        await wallet.close();
        await wallet.init({ password: 'testPassword' });
    }

    it('derives sequential receive and change addresses', async () => {
        await initWallet();

        const recv1 = await wallet.deriveReceiveAddress();
        expect(recv1).toMatch(/^bc(rt)?1q/);

        const recv2 = await wallet.deriveReceiveAddress();
        expect(recv2).toMatch(/^bc(rt)?1q/);
        expect(recv2).not.toBe(recv1);

        const change1 = await wallet.deriveChangeAddress();
        expect(change1).toMatch(/^bc(rt)?1q/);
    });

    it('generates silent payment address and caches in database', async () => {
        await initWallet();
        const spAddress = await wallet.generateSilentPaymentAddress();
        expect(spAddress).toMatch(/^tsp1qq/);

        // Verification of caching in db
        expect(await db.getSilentPaymentAddress()).toBe(spAddress);

        // Subsequent call returns cached address
        const cachedSp = await wallet.generateSilentPaymentAddress();
        expect(cachedSp).toBe(spAddress);
    });

    it('computes balance from unspent coins', async () => {
        await initWallet();

        await db.saveUnspentCoins([
            new Coin({ txid: '11', vout: 0, value: 50000, address: 'a1' }),
            new Coin({ txid: '22', vout: 1, value: 35000, address: 'a2' }),
        ]);

        const balance = await wallet.getBalance();
        expect(balance).toBe(85000);
    });

    it('scans addresses and updates unspent coins in database', async () => {
        await initWallet();
        const allAddrs = await db.getAllAddresses();

        const sampleCoin = new Coin({
            txid: '3333333333333333333333333333333333333333333333333333333333333333',
            vout: 0,
            value: 120000,
            address: allAddrs[0],
        });
        network.utxosByAddress.set(allAddrs[0], [sampleCoin]);

        await wallet.scan();

        const coins = await db.getUnspentCoins();
        expect(coins.length).toBe(1);
        expect(coins[0].value).toBe(120000);
        expect(coins[0].txid).toBe(sampleCoin.txid);
    });

    it('creates, signs, and sends transaction with standard inputs and change', async () => {
        await initWallet();
        const receiveAddr = await wallet.deriveReceiveAddress();

        const coin = new Coin({
            txid: '4444444444444444444444444444444444444444444444444444444444444444',
            vout: 0,
            value: 100000,
            address: receiveAddr,
        });
        await db.saveUnspentCoins([coin]);

        const destination = 'bcrt1qcr8te4kr609gcawutmrza0j4xv80jy8zeqchgx';
        const txid = await wallet.send(destination, 40000);

        expect(typeof txid).toBe('string');
        expect(txid.length).toBe(64);
        expect(network.broadcastedTxs.length).toBe(1);
    });

    it('throws insufficient funds error when creating tx with amount exceeding balance', async () => {
        await initWallet();
        await db.saveUnspentCoins([
            new Coin({ txid: '11', vout: 0, value: 10000, address: 'a1' }),
        ]);

        await expect(
            wallet.createAndSignTransaction([
                {
                    address: 'bcrt1qcr8te4kr609gcawutmrza0j4xv80jy8zeqchgx',
                    amount: 50000,
                },
            ]),
        ).rejects.toThrow(/Insufficient funds/);
    });

    it('throws error when sending to silent payment address with insufficient funds', async () => {
        await initWallet();
        await db.saveUnspentCoins([]);

        await expect(
            wallet.sendToSilentAddress('tsp1qqtest', 10000),
        ).rejects.toThrow(/Insufficient funds/);
    });

    it('sends payment to a silent payment address with coin selection and smallest outpoint', async () => {
        await initWallet();
        const addr1 = await wallet.deriveReceiveAddress();
        const addr2 = await wallet.deriveReceiveAddress();

        // 2 coins to exercise outpoint sorting (comparison by txid and vout)
        const coin1 = new Coin({
            txid: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
            vout: 1,
            value: 50000,
            address: addr1,
        });
        const coin2 = new Coin({
            txid: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
            vout: 0,
            value: 60000,
            address: addr2,
        });
        await db.saveUnspentCoins([coin1, coin2]);

        const spRecipient = await wallet.generateSilentPaymentAddress();
        const txid = await wallet.sendToSilentAddress(spRecipient, 30000);

        expect(typeof txid).toBe('string');
        expect(txid.length).toBe(64);
        expect(network.broadcastedTxs.length).toBe(1);
    });

    it('scans silent block and spends a silent payment tweaked UTXO via Schnorr signature', async () => {
        await initWallet();

        // Test handling block with empty transaction outputs
        const emptyBlock: SilentBlock = {
            type: 0,
            transactions: [
                {
                    txid: '0000000000000000000000000000000000000000000000000000000000000001',
                    scanTweak:
                        '02ccd442a997b40661a9a1e233884986a9c970f5da3b68514c6ea2533b708e2ae1',
                    outputs: [] as SilentBlock['transactions'][0]['outputs'],
                },
            ],
        };
        await wallet.scanSilentBlock(emptyBlock);

        // Scan the fixture silent block which matches the test mnemonic
        await wallet.scanSilentBlock(parsedSilentBlock);
        const coins = await db.getUnspentCoins();
        expect(coins.length).toBe(1);
        expect(coins[0].tweak).toBeDefined();

        // Spend the silent payment UTXO with Schnorr signature
        const signInputSpy = jest.spyOn(Psbt.prototype, 'signInput');
        const dest = await wallet.deriveReceiveAddress();
        const txid = await wallet.send(dest, 1000000);

        expect(typeof txid).toBe('string');
        expect(txid.length).toBe(64);

        const schnorrCall = signInputSpy.mock.calls.find(
            (call) =>
                typeof (call[1] as { signSchnorr?: unknown })?.signSchnorr ===
                'function',
        );
        expect(schnorrCall).toBeDefined();
        const signer = schnorrCall![1] as unknown as {
            sign: (hash?: Buffer) => Buffer;
        };
        expect(() => signer.sign()).toThrow('Taproot requires Schnorr');
        signInputSpy.mockRestore();
    });

    it('throws error when transaction signature validation fails', async () => {
        await initWallet();
        const receiveAddr = await wallet.deriveReceiveAddress();
        await db.saveUnspentCoins([
            new Coin({
                txid: '4444444444444444444444444444444444444444444444444444444444444444',
                vout: 0,
                value: 100000,
                address: receiveAddr,
            }),
        ]);

        jest.spyOn(
            wallet as unknown as { validateSignatures: () => boolean },
            'validateSignatures',
        ).mockReturnValueOnce(false);

        await expect(
            wallet.send('bcrt1qcr8te4kr609gcawutmrza0j4xv80jy8zeqchgx', 40000),
        ).rejects.toThrow('Invalid signature');
    });

    it('throws error when silent payment signature validation fails', async () => {
        await initWallet();
        const addr = await wallet.deriveReceiveAddress();
        await db.saveUnspentCoins([
            new Coin({
                txid: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
                vout: 0,
                value: 60000,
                address: addr,
            }),
        ]);
        const spRecipient = await wallet.generateSilentPaymentAddress();

        jest.spyOn(
            wallet as unknown as { validateSignatures: () => boolean },
            'validateSignatures',
        ).mockReturnValueOnce(false);

        await expect(
            wallet.sendToSilentAddress(spRecipient, 30000),
        ).rejects.toThrow('Invalid signature');
    });

    it('persists depths on wallet close', async () => {
        await initWallet();
        await wallet.deriveReceiveAddress();
        await wallet.deriveChangeAddress();

        await wallet.close();
        expect(db.status).toBe('closed');
        expect(await db.getReceiveDepth()).toBe(1);
        expect(await db.getChangeDepth()).toBe(1);
    });
});
