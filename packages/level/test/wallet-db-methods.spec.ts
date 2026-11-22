import fs from 'fs';
import { WalletDB } from '../src';
import { Coin } from '@silent-pay/wallet';

describe('WalletDB methods', () => {
    let walletDB: WalletDB;
    const testDbPath = './test/wallet-db-methods';

    beforeAll(async () => {
        walletDB = new WalletDB({
            location: testDbPath,
        });
        await walletDB.open();
    });

    afterAll(async () => {
        await walletDB.close();
        fs.rmSync(testDbPath, { recursive: true, force: true });
    });

    describe('Address and derivation path mapping', () => {
        const addr1 = 'bc1qcr8te4kr609gcawutmrza0j4xv80jy8zeqchgx';
        const path1 = "m/84'/0'/0'/0/0";
        const addr2 = 'bc1qgl5vlg0zdl7yvprgxj9fevsc6q6x5dmcvenxlt';
        const path2 = "m/84'/0'/0'/0/1";

        it('saves address and retrieves path bidirectionally', async () => {
            await walletDB.saveAddress(addr1, path1);
            await walletDB.saveAddress(addr2, path2);

            expect(await walletDB.getPathFromAddress(addr1)).toBe(path1);
            expect(await walletDB.getAddressFromPath(path1)).toBe(addr1);
            expect(await walletDB.getPathFromAddress(addr2)).toBe(path2);
            expect(await walletDB.getAddressFromPath(path2)).toBe(addr2);
        });

        it('checks existence of addresses via hasAddress', async () => {
            expect(await walletDB.hasAddress(addr1)).toBe(true);
            expect(
                await walletDB.hasAddress('bc1qunregisteredaddress00000000000'),
            ).toBe(false);
        });

        it('retrieves all saved addresses via getAllAddresses', async () => {
            const addresses = await walletDB.getAllAddresses();
            expect(addresses).toContain(addr1);
            expect(addresses).toContain(addr2);
            expect(addresses.length).toBe(2);
        });
    });

    describe('Receive and change depths', () => {
        it('persists and retrieves receive depth', async () => {
            await walletDB.setReceiveDepth(15);
            expect(await walletDB.getReceiveDepth()).toBe(15);
        });

        it('persists and retrieves change depth', async () => {
            await walletDB.setChangeDepth(7);
            expect(await walletDB.getChangeDepth()).toBe(7);
        });
    });

    describe('Unspent coins persistence', () => {
        it('saves and retrieves unspent Coin instances', async () => {
            const coin1 = new Coin({
                txid: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
                vout: 0,
                value: 25000,
                address: 'bc1qcr8te4kr609gcawutmrza0j4xv80jy8zeqchgx',
            });
            const coin2 = new Coin({
                txid: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
                vout: 1,
                value: 50000,
                address: 'bc1qgl5vlg0zdl7yvprgxj9fevsc6q6x5dmcvenxlt',
                tweak: '0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20',
            });

            await walletDB.saveUnspentCoins([coin1, coin2]);
            const retrieved = await walletDB.getUnspentCoins();

            expect(retrieved.length).toBe(2);
            expect(retrieved[0]).toBeInstanceOf(Coin);
            expect(retrieved[0].txid).toBe(coin1.txid);
            expect(retrieved[0].value).toBe(coin1.value);
            expect(retrieved[1].txid).toBe(coin2.txid);
            expect(retrieved[1].tweak).toBe(coin2.tweak);
        });
    });

    describe('Silent Payment address storage', () => {
        it('returns undefined when silent payment address is not set', async () => {
            const freshDbPath = './test/wallet-db-fresh';
            const freshDb = new WalletDB({ location: freshDbPath });
            await freshDb.open();

            const spAddr = await freshDb.getSilentPaymentAddress();
            expect(spAddr).toBeUndefined();

            await freshDb.close();
            fs.rmSync(freshDbPath, { recursive: true, force: true });
        });

        it('saves and retrieves silent payment address', async () => {
            const spAddress =
                'sp1qqw6vczcfpdh5nf5y2ky99kmqae0tr30hgdfg88parz50cp80wd2wqqauj52ymtc4xdkmx3tgyhrsemg2g3303xk2gtzfy8h8ejet8fz8jcw23zua';

            await walletDB.saveSilentPaymentAddress(spAddress);
            expect(await walletDB.getSilentPaymentAddress()).toBe(spAddress);
        });

        it('re-throws unexpected error in hasAddress when error is not LEVEL_NOT_FOUND', async () => {
            const closedDb = new WalletDB({ location: './test/closed-db-1' });
            await closedDb.open();
            await closedDb.close();
            await expect(closedDb.hasAddress('addr')).rejects.toThrow();
            fs.rmSync('./test/closed-db-1', { recursive: true, force: true });
        });

        it('re-throws unexpected error in getSilentPaymentAddress when error is not LEVEL_NOT_FOUND', async () => {
            const closedDb = new WalletDB({ location: './test/closed-db-2' });
            await closedDb.open();
            await closedDb.close();
            await expect(closedDb.getSilentPaymentAddress()).rejects.toThrow();
            fs.rmSync('./test/closed-db-2', { recursive: true, force: true });
        });
    });
});
