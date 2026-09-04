import axios, { AxiosError } from 'axios';
import { EsploraClient } from '../src';

jest.mock('axios', () => {
    const actual = jest.requireActual('axios');
    return {
        __esModule: true,
        ...actual,
        default: jest.fn(),
    };
});
const mockedAxios = axios as unknown as jest.MockedFunction<typeof axios>;

describe('EsploraClient', () => {
    let client: EsploraClient;

    beforeAll(() => {
        client = new EsploraClient({
            protocol: 'http',
            host: '127.0.0.1:8094',
            network: 'regtest',
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should get the latest block height', async () => {
        mockedAxios.mockResolvedValueOnce({ data: 100 } as any);
        const height = await client.getLatestBlockHeight();
        expect(height).toBeGreaterThan(0);
    });

    it('should get the latest block hash', async () => {
        mockedAxios.mockResolvedValueOnce({ data: '0'.repeat(64) } as any);
        const hash = await client.getLatestBlockHash();
        expect(hash).toMatch(/^[0-9a-f]{64}$/);
    });

    it('should get a block by hash', async () => {
        mockedAxios.mockResolvedValueOnce({ data: 100 } as any);
        mockedAxios.mockResolvedValueOnce({ data: '0'.repeat(64) } as any);
        
        const height = await client.getLatestBlockHeight();
        const hash = await client.getBlockHash(height);
        expect(hash).toMatch(/^[0-9a-f]{64}$/);
    });

    describe('Error Handling', () => {
        let errorClient: EsploraClient;

        beforeAll(() => {
            errorClient = new EsploraClient({
                protocol: 'http',
                host: '127.0.0.1:8094',
                network: 'regtest',
            });
        });

        it('should correctly propagate a 404 AxiosError', async () => {
            mockedAxios.mockImplementationOnce(() => {
                const response = {
                    status: 404,
                    data: { title: 'Block not found' },
                } as any;
                const error = new AxiosError('Request failed with status code 404', '404', {} as any, {} as any, response);
                return Promise.reject(error);
            });

            jest.spyOn(console, 'error').mockImplementation(() => {});

            await expect(errorClient.getLatestBlockHeight()).rejects.toThrow(
                'Request failed with status code 404'
            );

            expect(mockedAxios).toHaveBeenCalled();
            expect(console.error).toHaveBeenCalled();
        });

        it('should correctly propagate a timeout AxiosError', async () => {
            mockedAxios.mockImplementationOnce(() => {
                const error = new AxiosError('timeout of 5000ms exceeded', 'ECONNABORTED');
                return Promise.reject(error);
            });

            await expect(errorClient.getLatestBlockHash()).rejects.toThrow(
                'timeout of 5000ms exceeded'
            );

            expect(mockedAxios).toHaveBeenCalled();
        });

        it('should correctly propagate a non-Axios error', async () => {
            mockedAxios.mockImplementationOnce(() => {
                const error = new Error('Some random runtime error');
                return Promise.reject(error);
            });

            await expect(errorClient.getLatestBlockHash()).rejects.toThrow(
                'Some random runtime error'
            );

            expect(mockedAxios).toHaveBeenCalled();
        });

        it('should not throw if the request succeeds', async () => {
            const mockData = 100;
            mockedAxios.mockResolvedValueOnce({
                data: mockData,
            } as any);

            const height = await errorClient.getLatestBlockHeight();
            expect(height).toBe(mockData);
            expect(mockedAxios).toHaveBeenCalled();
        });
    });
});


