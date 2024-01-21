import { EsploraClient, Wallet, WalletDB } from '../src/wallet';
import * as fs from 'fs';
import { BitcoinRpcClient } from './helpers/bitcoin-rpc-client';

describe('Wallet', () => {
    let wallet: Wallet;
    let address: string;
    let bitcoinRpcClient: BitcoinRpcClient;

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

        bitcoinRpcClient = new BitcoinRpcClient();
        await bitcoinRpcClient.init();

        await bitcoinRpcClient.mineToAddress(
            101,
            await bitcoinRpcClient.getNewAddress(),
        );
    });

    it('should initialise the wallet', async () => {
        await wallet.init(
            'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
        );
    });

    it('should derive first receive address', async () => {
        address = await wallet.deriveReceiveAddress();
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

    it('should rescan all addresses', async () => {
        await bitcoinRpcClient.sendToAddress(address, 0.1);
        await bitcoinRpcClient.mineToAddress(
            3,
            await bitcoinRpcClient.getNewAddress(),
        );

        await wallet.scan();
    });

    it('should get balance', async () => {
        // we have to do this because esplora is not always in sync with the node
        let retryCount = 5;
        while (retryCount > 0) {
            const balance = await wallet.getBalance();
            if (balance === 0) {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                await wallet.scan();
            }
            retryCount--;
        }

        expect(await wallet.getBalance()).toBe(10000000);
    });

    afterAll(async () => {
        await wallet.close();
        fs.rmSync('./test/wallet', { recursive: true, force: true });
    });
});
