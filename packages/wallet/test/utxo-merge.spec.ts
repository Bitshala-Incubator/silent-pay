import { Wallet, Coin, DbInterface, NetworkInterface } from '../src';
import { regtest } from 'bitcoinjs-lib/src/networks';
import { SilentBlock } from '@silent-pay/core';

/**
 * In-memory mock of DbInterface.
 * Only the methods used by scan() and scanSilentBlock() are implemented.
 */
function createMockDb(initialCoins: Coin[] = []): DbInterface {
    let coins: Coin[] = [...initialCoins];
    const addresses: Map<string, string> = new Map();

    return {
        open: jest.fn().mockResolvedValue(undefined),
        close: jest.fn().mockResolvedValue(undefined),
        getStatus: jest.fn().mockReturnValue('open'),
        getVersion: jest.fn().mockResolvedValue(1),
        setVersion: jest.fn().mockResolvedValue(undefined),
        getMasterKey: jest.fn().mockResolvedValue({
            encryptedPrivateKey: '',
            encryptedChainCode: '',
        }),
        setMasterKey: jest.fn().mockResolvedValue(undefined),
        saveAddress: jest.fn(async (address: string, path: string) => {
            addresses.set(address, path);
        }),
        getPathFromAddress: jest.fn(async (address: string) => {
            return addresses.get(address) ?? '';
        }),
        getAddressFromPath: jest.fn().mockResolvedValue(''),
        hasAddress: jest.fn().mockResolvedValue(false),
        getReceiveDepth: jest.fn().mockResolvedValue(0),
        setReceiveDepth: jest.fn().mockResolvedValue(undefined),
        getChangeDepth: jest.fn().mockResolvedValue(0),
        setChangeDepth: jest.fn().mockResolvedValue(undefined),
        getAllAddresses: jest.fn(async () => Array.from(addresses.keys())),
        saveUnspentCoins: jest.fn(async (newCoins: Coin[]) => {
            coins = newCoins;
        }),
        getUnspentCoins: jest.fn(async () => coins),
        saveSilentPaymentAddress: jest.fn().mockResolvedValue(undefined),
        getSilentPaymentAddress: jest.fn().mockResolvedValue(undefined),
    };
}

function createMockNetwork(
    utxosByAddress: Record<string, Coin[]> = {},
): NetworkInterface {
    return {
        get network() {
            return regtest;
        },
        getLatestBlockHeight: jest.fn().mockResolvedValue(100),
        getLatestBlockHash: jest.fn().mockResolvedValue('00'.repeat(32)),
        getBlockHash: jest.fn().mockResolvedValue('00'.repeat(32)),
        getUTXOs: jest.fn(async (address: string) => {
            return utxosByAddress[address] ?? [];
        }),
        getFeeRate: jest.fn().mockResolvedValue(1),
        broadcast: jest.fn().mockResolvedValue(undefined),
    };
}

const normalCoin = new Coin({
    txid: 'aaaa'.repeat(16),
    vout: 0,
    value: 50000,
    address: 'bcrt1qnormal',
    status: { isConfirmed: true },
});

const silentCoin = new Coin({
    txid: 'bbbb'.repeat(16),
    vout: 0,
    value: 40000,
    address: 'bcrt1psilent',
    status: { isConfirmed: true },
    tweak: 'cc'.repeat(32),
});

describe('UTXO merge across scan flows', () => {
    it('scanSilentBlock() should preserve existing normal UTXOs', async () => {
        const db = createMockDb([normalCoin]);
        const network = createMockNetwork();

        const wallet = new Wallet({ db, networkClient: network });

        // Set dummy keys so scanSilentBlock() can evaluate its arguments
        const dummyKey = new Uint8Array(33);
        wallet['scanKey'] = { privateKey: dummyKey } as any;
        wallet['spendKey'] = { publicKey: dummyKey } as any;

        const matchedSilentCoin = new Coin({ ...silentCoin });
        jest.spyOn(wallet as any, 'matchSilentBlockOutputs').mockReturnValue([
            matchedSilentCoin,
        ]);

        const fakeSilentBlock = { type: 0, transactions: [] } as SilentBlock;
        await wallet.scanSilentBlock(fakeSilentBlock);

        const stored = await db.getUnspentCoins();
        expect(stored).toHaveLength(2);
        expect(stored).toContainEqual(
            expect.objectContaining({
                txid: normalCoin.txid,
                vout: normalCoin.vout,
            }),
        );
        expect(stored).toContainEqual(
            expect.objectContaining({
                txid: silentCoin.txid,
                vout: silentCoin.vout,
            }),
        );
    });

    it('scan() should preserve existing silent-payment UTXOs', async () => {
        const addr = 'bcrt1qscanaddr';
        const db = createMockDb([silentCoin]);
        // Seed an address so scan() has something to query
        await db.saveAddress(addr, "m/84'/0'/0'/0/0");

        const freshNormalCoin = new Coin({
            txid: 'dddd'.repeat(16),
            vout: 1,
            value: 60000,
            address: addr,
            status: { isConfirmed: true },
        });

        const network = createMockNetwork({ [addr]: [freshNormalCoin] });
        const wallet = new Wallet({ db, networkClient: network });

        await wallet.scan();

        const stored = await db.getUnspentCoins();
        expect(stored).toHaveLength(2);
        expect(stored).toContainEqual(
            expect.objectContaining({
                txid: silentCoin.txid,
                vout: silentCoin.vout,
                tweak: silentCoin.tweak,
            }),
        );
        expect(stored).toContainEqual(
            expect.objectContaining({
                txid: freshNormalCoin.txid,
                vout: freshNormalCoin.vout,
            }),
        );
    });

    it('should de-duplicate by txid:vout with incoming coin winning', async () => {
        const existingCoin = new Coin({
            txid: 'eeee'.repeat(16),
            vout: 0,
            value: 10000,
            address: 'bcrt1qold',
            status: { isConfirmed: false },
        });

        const incomingCoin = new Coin({
            txid: 'eeee'.repeat(16),
            vout: 0,
            value: 10000,
            address: 'bcrt1qold',
            status: { isConfirmed: true },
        });

        const db = createMockDb([existingCoin]);
        const network = createMockNetwork();
        const wallet = new Wallet({ db, networkClient: network });

        // Set dummy keys so scanSilentBlock() can evaluate its arguments
        const dummyKey = new Uint8Array(33);
        wallet['scanKey'] = { privateKey: dummyKey } as any;
        wallet['spendKey'] = { publicKey: dummyKey } as any;

        jest.spyOn(wallet as any, 'matchSilentBlockOutputs').mockReturnValue([
            incomingCoin,
        ]);

        const fakeSilentBlock = { type: 0, transactions: [] } as SilentBlock;
        await wallet.scanSilentBlock(fakeSilentBlock);

        const stored = await db.getUnspentCoins();
        expect(stored).toHaveLength(1);
        expect(stored[0].status.isConfirmed).toBe(true);
    });
});
