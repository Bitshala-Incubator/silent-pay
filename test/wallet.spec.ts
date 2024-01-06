import { EsploraClient, Wallet, WalletDB } from '../src/wallet';
import * as fs from 'fs';

describe('Wallet', () => {
    let wallet: Wallet;

    beforeAll(async () => {
        const walletDB = new WalletDB({
            location: './test/wallet',
        });

        wallet = new Wallet({
            db: walletDB,
            networkClient: new EsploraClient({
                protocol: 'http',
                host: '127.0.0.1:8094',
                network: 'regtest',
            }),
        });
    });

    it('should initialise the wallet', async () => {
        await wallet.init(
            'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
        );
    });

    it('should derive first receive address', async () => {
        const address = await wallet.deriveReceiveAddress();
        expect(address).toBe('bcrt1qcr8te4kr609gcawutmrza0j4xv80jy8zeqchgx');
    });

    it('should derive second receive address', async () => {
        const address = await wallet.deriveReceiveAddress();
        expect(address).toBe('bcrt1qnjg0jd8228aq7egyzacy8cys3knf9xvr3v5hfj');
    });

    it('should derive first change address', async () => {
        const address = await wallet.deriveChangeAddress();
        expect(address).toBe('bcrt1q8c6fshw2dlwun7ekn9qwf37cu2rn755ufhry49');
    });

    afterAll(async () => {
        await wallet.close();
        fs.rmSync('./test/wallet', { recursive: true, force: true });
    });
});
