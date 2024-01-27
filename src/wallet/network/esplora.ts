import { NetworkInterface } from './network.interface.ts';
import { URL } from 'url';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { Network } from 'bitcoinjs-lib';
import { regtest, testnet, bitcoin } from 'bitcoinjs-lib/src/networks';
import { Coin } from '../coin.ts';

export type EsploraConfigOptions = {
    network: 'testnet' | 'main' | 'regtest';
    protocol: 'http' | 'https';
    host: string;
};

export class EsploraClient implements NetworkInterface {
    private readonly url: string;
    private readonly _network: string;

    constructor(config: EsploraConfigOptions) {
        let pathPrefix;
        switch (config.network) {
            case 'testnet':
                pathPrefix = '/testnet/api';
                break;
            case 'regtest':
                pathPrefix = '/regtest/api';
                break;
            case 'main':
            default:
                pathPrefix = '/api';
        }
        this._network = config.network;
        this.url = new URL(
            `${config.protocol}://${config.host}${pathPrefix}`,
        ).toString();
    }

    get network(): Network {
        switch (this._network) {
            case 'testnet':
                return testnet;
            case 'regtest':
                return regtest;
            case 'main':
            default:
                return bitcoin;
        }
    }

    private async request(config: AxiosRequestConfig) {
        try {
            const response = await axios(config);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.data?.title) {
                    console.error(
                        `${config.method} Error: ${
                            config.url
                        }\n${JSON.stringify(error.response.data)}`,
                    );
                }
            } else throw error;
        }
    }

    async getLatestBlockHeight(): Promise<number> {
        return await this.request({
            method: 'GET',
            url: `${this.url}/blocks/tip/height`,
        });
    }

    async getLatestBlockHash(): Promise<string> {
        return await this.request({
            method: 'GET',
            url: `${this.url}/blocks/tip/hash`,
        });
    }

    async getBlockHash(height: number): Promise<string> {
        return await this.request({
            method: 'GET',
            url: `${this.url}//block-height/${height}`,
        });
    }

    async getUTXOs(address: string): Promise<Coin[]> {
        return (
            await this.request({
                method: 'GET',
                url: `${this.url}/address/${address}/utxo`,
            })
        ).map((utxo: object) => new Coin({ ...utxo, address }));
    }

    async getFeeRate(): Promise<number> {
        return (
            await this.request({
                method: 'GET',
                url: `${this.url}/fee-estimates`,
            })
        )[1];
    }

    async broadcast(txHex: string): Promise<void> {
        await this.request({
            method: 'POST',
            url: `${this.url}/tx`,
            data: txHex,
        });
    }
}
