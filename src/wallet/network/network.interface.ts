import { Network } from 'bitcoinjs-lib';
import { Coin } from '../coin.ts';

export type NetworkInterface = {
    get network(): Network;
    getLatestBlockHeight(): Promise<number>;
    getLatestBlockHash(): Promise<string>;
    getBlockHash(height: number): Promise<string>;
    getUTXOs(address: string): Promise<Coin[]>;
};
