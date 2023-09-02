import { Outpoint, PrivateKey } from './interface';
import HDPrivateKey from 'bcoin/dist/hd/private';
export declare const deriveSilentPaymentsKeyPair: (master: HDPrivateKey) => {
    scanKey: HDPrivateKey;
    spendKey: HDPrivateKey;
};
export declare const hashOutpoints: (outpoints: Outpoint[]) => Buffer;
export declare const calculateSumOfPrivateKeys: (keys: PrivateKey[]) => Buffer;
export declare const serialiseUint32: (n: number) => Buffer;
