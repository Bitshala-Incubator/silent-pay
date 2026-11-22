import { Wallet } from '../src/wallet';
import { DbInterface } from '../src/db.interface';
import { NetworkInterface } from '../src/network.interface';
import { Coin } from '../src/coin';
import { networks, Network } from 'bitcoinjs-lib';

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
        void address;
        return [];
    }
    async broadcast(txHex: string): Promise<void> {
        void txHex;
    }
}

type WalletInternals = {
    masterKey: unknown;
    spendKey: unknown;
    scanKey: unknown;
};

describe('Wallet initialization and key derivation', () => {
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
            lookahead: 3,
        });
    });

    it('throws error when setPassword is called before init', async () => {
        await expect(wallet.setPassword('pass')).rejects.toThrow(
            'Wallet not initialized. Please call src.init()',
        );
    });

    it('derives spendKey and scanKey immediately upon mnemonic init', async () => {
        await wallet.init({ mnemonic: testMnemonic });

        const internals = wallet as unknown as WalletInternals;
        expect(internals.masterKey).toBeDefined();
        expect(internals.spendKey).toBeDefined();
        expect(internals.scanKey).toBeDefined();

        // Calling generateSilentPaymentAddress directly must succeed without error
        const spAddress = await wallet.generateSilentPaymentAddress();
        expect(spAddress).toMatch(/^tsp1qq/);
    });

    it('restores spendKey and scanKey from encrypted master key in db', async () => {
        await wallet.init({
            mnemonic: testMnemonic,
            password: 'securePassword',
        });
        await wallet.close();

        const restoredWallet = new Wallet({
            db,
            networkClient: network,
        });
        await restoredWallet.init({ password: 'securePassword' });

        const internals = restoredWallet as unknown as WalletInternals;
        expect(internals.masterKey).toBeDefined();
        expect(internals.spendKey).toBeDefined();
        expect(internals.scanKey).toBeDefined();

        const spAddress = await restoredWallet.generateSilentPaymentAddress();
        expect(spAddress).toMatch(/^tsp1qq/);
    });

    it('returns coin type 0 for mainnet and 1 for testnet/regtest', async () => {
        await wallet.init({ mnemonic: testMnemonic });
        expect(wallet.getCoinType()).toBe(1);

        const mainNetwork = new MockNetwork();
        mainNetwork.network = networks.bitcoin;
        const mainWallet = new Wallet({
            db: new MockDb(),
            networkClient: mainNetwork,
        });
        expect(mainWallet.getCoinType()).toBe(0);
    });
});
