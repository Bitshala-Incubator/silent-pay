import { Buffer } from 'buffer';
export declare const encodeSilentPaymentAddress: (scanKey: Uint8Array, spendKey: Uint8Array, hrp?: string, version?: number) => string;
export declare const decodeSilentPaymentAddress: (address: string, hrp?: string) => {
    scanKey: Buffer;
    spendKey: Buffer;
};
export declare const createLabeledSilentPaymentAddress: (scanKey: Uint8Array, spendKey: Uint8Array, m: Buffer, hrp?: string, version?: number) => string;
