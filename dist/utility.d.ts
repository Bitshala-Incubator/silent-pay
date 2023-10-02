import { Outpoint, PrivateKey } from './interface';
import { Buffer } from 'buffer';
export declare const hashOutpoints: (outpoints: Outpoint[]) => Buffer;
export declare const calculateSumOfPrivateKeys: (keys: PrivateKey[]) => Buffer;
export declare const serialiseUint32: (n: number) => Buffer;
