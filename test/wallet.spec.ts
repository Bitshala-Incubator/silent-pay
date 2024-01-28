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

    it('should send a payment to an address', async () => {
        const txid = await wallet.send(
            await bitcoinRpcClient.getNewAddress(),
            5000000,
        );

        expect(txid).toBeDefined();

        // get the transaction from the node and check it has been broadcasted
        const tx = await bitcoinRpcClient.getMempoolEntry(txid);
        expect(tx).toBeDefined();
    });

    it('should confirm previous transaction, rescan and update wallet balance', async () => {
        await bitcoinRpcClient.mineToAddress(
            1,
            await bitcoinRpcClient.getNewAddress(),
        );

        let retryCount = 5;
        while (retryCount > 0) {
            const balance = await wallet.getBalance();
            if (balance === 10000000) {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                await wallet.scan();
            }
            retryCount--;
        }

        expect(await wallet.getBalance()).toBeLessThan(5000000);
    });

    it('should send a payment to a sp address', async () => {
        const txid = await wallet.sendToSilentAddress(
            'tsp1qqw6vczcfpdh5nf5y2ky99kmqae0tr30hgdfg88parz50cp80wd2wqqauj52ymtc4xdkmx3tgyhrsemg2g3303xk2gtzfy8h8ejet8fz8jc693hkx',
            4000000,
        );

        expect(txid).toBeDefined();

        // get the transaction from the node and check it has been broadcasted
        const tx = await bitcoinRpcClient.getMempoolEntry(txid);
        expect(tx).toBeDefined();
    });

    afterAll(async () => {
        await wallet.close();
        fs.rmSync('./test/wallet', { recursive: true, force: true });
    });
});
