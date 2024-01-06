import { WalletDB } from '../src/wallet';
import fs from 'fs';

describe('Wallet DB', () => {
    let walletDB: WalletDB;

    beforeAll(async () => {
        walletDB = new WalletDB({
            location: './test/wallet-db',
        });

        await walletDB.open();
    });

    it('should open the wallet database', async () => {
        expect(walletDB.getStatus()).toBe('open');
    });

    it('should set the wallet database version', async () => {
        await walletDB.setVersion(1);
    });

    it('should get the wallet database version', async () => {
        expect(await walletDB.getVersion()).toBe(1);
    });

    afterAll(async () => {
        await walletDB.close();
        fs.rmSync('./test/wallet-db', { recursive: true, force: true });
    });
});
