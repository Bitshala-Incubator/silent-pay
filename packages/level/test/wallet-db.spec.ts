import fs from 'fs';
import { WalletDB } from '../src';

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

    it('should set and retrieve encryptedPrivateKey and encryptedChainCode', async () => {
        const samplePrivateKey = 'samplePrivateKey';
        const sampleChainCode = 'sampleChainCode';
        await walletDB.setMasterKey(samplePrivateKey, sampleChainCode);
        const { encryptedPrivateKey, encryptedChainCode } =
            await walletDB.getMasterKey();
        expect(encryptedPrivateKey).toStrictEqual(samplePrivateKey);
        expect(encryptedChainCode).toStrictEqual(sampleChainCode);
    });

    afterAll(async () => {
        await walletDB.close();
        fs.rmSync('./test/wallet-db', { recursive: true, force: true });
    });
});
