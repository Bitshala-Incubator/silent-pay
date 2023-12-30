import { EsploraClient } from '../src/wallet';

describe('EsploraClient', () => {
    let client: EsploraClient;

    beforeAll(() => {
        client = new EsploraClient({
            protocol: 'https',
            host: 'blockstream.info',
            network: 'testnet',
        });
    });

    it('should get the latest block height', async () => {
        const height = await client.getLatestBlockHeight();
        expect(height).toBeGreaterThan(0);
    });

    it('should get the latest block hash', async () => {
        const hash = await client.getLatestBlockHash();
        expect(hash).toMatch(/^[0-9a-f]{64}$/);
    });

    it('should get a block by hash', async () => {
        const height = await client.getLatestBlockHeight();
        const hash = await client.getBlockHash(height);
        expect(hash).toMatch(/^[0-9a-f]{64}$/);
    });
});
