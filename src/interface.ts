export type Outpoint = {
    txid: string;
    vout: number;
};

export type PrivateKey = {
    key: string;
    isXOnly: boolean;
};
