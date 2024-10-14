import { Buffer } from 'buffer';

export type Outpoint = {
    txid: string;
    vout: number;
};

export type PrivateKey = {
    key: string;
    isXOnly: boolean;
};

export type RecipientAddress = {
    address: string;
    amount: number;
};

export type Output = {
    script: Buffer;
    value: number;
};

export type LabelMap = { [key: string]: string };

export type Input = {
    hash: Buffer;
    index: number;
    script: Buffer;
    sequence: number;
    witness: Buffer[];
};

export type SilentBlock = {
    type: number;
    transactions: {
        txid: string;
        outputs: {
            value: number;
            pubKey: string;
            vout: number;
        }[];
        scanTweak: string;
    }[];
};
