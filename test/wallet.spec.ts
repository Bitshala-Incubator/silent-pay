import { EsploraClient, Wallet, WalletDB } from '../src/wallet';

describe('Wallet', () => {
    let wallet: Wallet;

    beforeAll(async () => {
        const walletDB = new WalletDB({
            location: './test/wallet',
        });

        wallet = new Wallet({
            db: walletDB,
            networkClient: new EsploraClient({
                protocol: 'https',
                host: 'blockstream.info',
                network: 'main',
            }),
        });
    });

    it('should initialise the wallet', async () => {
        await wallet.init();
    });

    it('should load the wallet', async () => {
        await wallet.load(
            'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
        );
    });

    it('should derive first receive address', async () => {
        const address = await wallet.deriveReceiveAddress();
        expect(address).toBe('bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu');
    });

    it('should derive second receive address', async () => {
        const address = await wallet.deriveReceiveAddress();
        expect(address).toBe('bc1qnjg0jd8228aq7egyzacy8cys3knf9xvrerkf9g');
    });

    it('should derive first change address', async () => {
        const address = await wallet.deriveChangeAddress();
        expect(address).toBe('bc1q8c6fshw2dlwun7ekn9qwf37cu2rn755upcp6el');
    });

    afterAll(async () => {
        await wallet.close();
    });
});
