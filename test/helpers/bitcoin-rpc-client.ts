import axios, { AxiosError, AxiosRequestConfig } from 'axios';

export class BitcoinRpcClient {
    url: string;
    config: AxiosRequestConfig;

    constructor() {
        const user = process.env.BITCOIN_RPC_USER;
        const password = process.env.BITCOIN_RPC_PASSWORD;
        const host = process.env.BITCOIN_RPC_HOST;
        this.url = `http://${user}:${password}@${host}`;
        this.config = {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
        };
    }

    async init() {
        let loadWallet = false;
        try {
            await this.createWallet('default');
        } catch (e) {
            if (
                e instanceof AxiosError &&
                e.response?.data.error.message.includes(
                    'Database already exists.',
                )
            ) {
                loadWallet = true;
            } else {
                throw e;
            }
        }
        try {
            const result = await this.getWalletInfo();
            if (result['walletname'] === 'default') {
                loadWallet = false;
            }
        } catch (e) {
            if (
                e instanceof AxiosError &&
                !e.response?.data.error.message.includes('No wallet is loaded.')
            ) {
                throw e;
            }
        }
        try {
            if (loadWallet) {
                await this.loadWallet('default');
                const address = await this.getNewAddress();
                await this.mineToAddress(150, address);
            }
        } catch (e) {
            if (
                e instanceof AxiosError &&
                !e.response?.data.error.message.includes(
                    'Unable to obtain an exclusive lock on the database',
                )
            ) {
                throw e;
            }
        }
    }

    private async request(config: AxiosRequestConfig) {
        try {
            const response = await axios.request({
                ...this.config,
                ...config,
            });
            return response.data?.result;
        } catch (e) {
            if (e instanceof AxiosError) {
                if (e.response?.data.error) {
                    // eslint-disable-next-line no-console
                    console.log(e.response.data);
                    throw new Error(e.response.data.error.message);
                } else {
                    throw new Error(e.message);
                }
            } else {
                throw e;
            }
        }
    }

    async createWallet(walletName: string) {
        return await this.request({
            url: this.url,
            data: {
                method: 'createwallet',
                params: [walletName],
            },
        });
    }

    async getWalletInfo() {
        return await this.request({
            url: this.url,
            data: {
                method: 'getwalletinfo',
                params: [],
            },
        });
    }

    async loadWallet(walletName: string) {
        return await this.request({
            url: this.url,
            data: {
                method: 'loadwallet',
                params: [walletName],
            },
        });
    }

    async getNewAddress() {
        return await this.request({
            url: this.url,
            data: {
                method: 'getnewaddress',
                params: [],
            },
        });
    }

    async mineToAddress(numBlocks: number, address: string) {
        return await this.request({
            url: this.url,
            data: {
                method: 'generatetoaddress',
                params: [numBlocks, address],
            },
        });
    }

    async sendToAddress(address: string, amount: number) {
        return await this.request({
            url: this.url,
            data: {
                method: 'sendtoaddress',
                params: [address, amount],
            },
        });
    }
}
