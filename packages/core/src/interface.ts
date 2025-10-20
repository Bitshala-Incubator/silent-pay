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
    script: Uint8Array;
    value: number;
};

export type LabelMap = { [key: string]: string };

export type Input = {
    hash: Uint8Array;
    index: number;
    script: Uint8Array;
    sequence: number;
    witness: Uint8Array[];
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
