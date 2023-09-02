export declare const encodeSilentPaymentAddress: (scanKey: Buffer, spendKey: Buffer, hrp?: string, version?: number) => string;
export declare const decodeSilentPaymentAddress: (address: string, hrp?: string) => {
    scanKey: Buffer;
    spendKey: Buffer;
};
export declare const createLabeledSilentPaymentAddress: (scanKey: Buffer, spendKey: Buffer, m: Buffer, hrp?: string, version?: number) => string;
