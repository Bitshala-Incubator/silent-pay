import { Network } from 'bitcoinjs-lib';

export type NetworkInterface = {
    get network(): Network;
    getLatestBlockHeight(): Promise<number>;
    getLatestBlockHash(): Promise<string>;
    getBlockHash(height: number): Promise<string>;
};
