export type NetworkInterface = {
    getLatestBlockHeight(): Promise<number>;
    getLatestBlockHash(): Promise<string>;
    getBlockHash(height: number): Promise<string>;
};
