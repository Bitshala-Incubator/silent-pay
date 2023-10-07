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
