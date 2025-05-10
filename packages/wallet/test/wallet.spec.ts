import * as fs from 'fs';
import { BitcoinRpcClient } from './helpers/bitcoin-rpc-client';
import { Wallet } from '../src';
import { WalletDB } from '@silent-pay/level/src';
import { EsploraClient } from '@silent-pay/esplora/src';
import { parsedSilentBlock } from './helpers/silent-block.fixtures';

describe('Wallet', () => {
    let wallet: Wallet;
    let address: string;
    let walletDB: WalletDB;
    let bitcoinRpcClient: BitcoinRpcClient;
    let silentPaymentAddress: string;

    beforeAll(async () => {
        walletDB = new WalletDB({
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

    it('should initialise the wallet and save lookahead addresses', async () => {
        await wallet.init({
            mnemonic:
                'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
        });
        const allAddresses = await walletDB.getAllAddresses();
        expect(allAddresses).toStrictEqual([
            'bcrt1qcr8te4kr609gcawutmrza0j4xv80jy8zeqchgx',
            'bcrt1qgl5vlg0zdl7yvprgxj9fevsc6q6x5dmcvenxlt',
            'bcrt1qgswpjzsqgrm2qkfkf9kzqpw6642ptrgz4wwff7',
            'bcrt1qhxgzmkmwvrlwvlfn4qe57lx2qdfg8physujr0f',
            'bcrt1qm97vqzgj934vnaq9s53ynkyf9dgr05rat8p3ef',
            'bcrt1qncdts3qm2guw3hjstun7dd6t3689qg42eqsfxf',
            'bcrt1qnjg0jd8228aq7egyzacy8cys3knf9xvr3v5hfj',
            'bcrt1qnpzzqjzet8gd5gl8l6gzhuc4s9xv0djt8vazj8',
            'bcrt1qp59yckz4ae5c4efgw2s5wfyvrz0ala7rqr7utc',
            'bcrt1qtet8q6cd5vqm0zjfcfm8mfsydju0a29gq0p9sl',
        ]);
    });

    it('should set a new password, close and reopen the wallet with the same password', async () => {
        const password = 'notSoSecretPassword';
        await wallet.setPassword(password);
        await wallet.close();
        await wallet.init({ password });
    });

    it('should derive first receive address', async () => {
        address = await wallet.deriveReceiveAddress();
        expect(address).toBe('bcrt1qcr8te4kr609gcawutmrza0j4xv80jy8zeqchgx');
        const allAddresses = await walletDB.getAllAddresses();
        expect(allAddresses.length).toStrictEqual(11);
    });

    it('should derive second receive address', async () => {
        const address = await wallet.deriveReceiveAddress();
        expect(address).toBe('bcrt1qnjg0jd8228aq7egyzacy8cys3knf9xvr3v5hfj');
        const allAddresses = await walletDB.getAllAddresses();
        expect(allAddresses.length).toStrictEqual(12);
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

    it('should generate a silent payment address', async () => {
        silentPaymentAddress = await wallet.generateSilentPaymentAddress();
        expect(silentPaymentAddress).toBeDefined();
    });

    it('should send a payment to a sp address', async () => {
        const txid = await wallet.sendToSilentAddress(
            silentPaymentAddress,
            4000000,
        );

        expect(txid).toBeDefined();

        // get the transaction from the node and check it has been broadcasted
        const tx = await bitcoinRpcClient.getMempoolEntry(txid);
        expect(tx).toBeDefined();
    });

    it('should match UTXOs from a silent block without relying on db', async () => {
        const scanKey = wallet['masterKey'].derivePath(
            `m/352'/${wallet.getCoinType()}'/0'/1'/0`,
        );
        const spendKey = wallet['masterKey'].derivePath(
            `m/352'/${wallet.getCoinType()}'/0'/0'/0`,
        );

        expect(scanKey.privateKey).toBeDefined();

        const matchedUTXOs = wallet['matchSilentBlockOutputs'](
            parsedSilentBlock,
            scanKey.privateKey!,
            spendKey.publicKey,
        );
        expect(matchedUTXOs.length).toBeGreaterThan(0);
        expect(matchedUTXOs[0]).toHaveProperty('txid');
    });

    it.each(parsedSilentBlock.transactions)(
        'should scan silent block transaction %s and update UTXOs',
        async (transaction) => {
            await wallet.scanSilentBlock(parsedSilentBlock);
            const utxos = await walletDB.getUnspentCoins();

            expect(utxos).toContainEqual(
                expect.objectContaining({
                    txid: transaction.txid,
                    vout: transaction.outputs[0].vout,
                    value: transaction.outputs[0].value,
                    address: expect.stringMatching(/^bcrt1p/),
                    status: { isConfirmed: true },
                    tweak: expect.stringMatching(/^[0-9a-f]{64}$/),
                }),
            );
        },
    );

    it('should spend a silent payment UTXO', async () => {
        const allCoins = await walletDB.getUnspentCoins();

        // find silent payment UTXOs (those with tweaks)
        const silentCoins = allCoins.filter((coin) => coin.tweak);
        expect(silentCoins.length).toBeGreaterThan(0);

        // ensure it's confirmed on-chain
        await bitcoinRpcClient.mineToAddress(
            1,
            await bitcoinRpcClient.getNewAddress(),
        );
        await wallet.scan();

        // spend one of the silent payment UTXOs
        const destinationAddress = await wallet.deriveReceiveAddress();
        const amountToSpend = (await wallet.getBalance()) * 0.9; // leave some for fees

        const txid = await wallet.send(
            destinationAddress,
            Math.floor(amountToSpend),
        );
        expect(txid).toBeDefined();

        const tx = await bitcoinRpcClient.getMempoolEntry(txid);
        expect(tx).toBeDefined();
    });

    afterAll(async () => {
        await wallet.close();
        fs.rmSync('./test/wallet', { recursive: true, force: true });
    });
});
