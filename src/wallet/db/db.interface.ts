import { Buffer } from 'buffer';
import { Coin } from '../coin.ts';

export type DbInterface = {
    open(): Promise<void>;
    close(): Promise<void>;
    getStatus(): string;
    getVersion(): Promise<number>;
    setVersion(version: number): Promise<void>;
    getMasterKey(): Promise<{ privateKey: Buffer; chaincode: Buffer }>;
    setMasterKey(privateKey: Buffer, chaincode: Buffer): Promise<void>;
    saveAddress(address: string, path: string): Promise<void>;
    getAddress(address: string): Promise<string>;
    hasAddress(address: string): Promise<boolean>;
    getReceiveDepth(): Promise<number>;
    setReceiveDepth(depth: number): Promise<void>;
    getChangeDepth(): Promise<number>;
    setChangeDepth(depth: number): Promise<void>;
    getAllAddresses(): Promise<string[]>;
    saveUnspentCoins(coins: Coin[]): Promise<void>;
    getUnspentCoins(): Promise<Coin[]>;
    saveSilentPaymentAddress(address: string): Promise<void>;
    getSilentPaymentAddress(): Promise<string>;
};
