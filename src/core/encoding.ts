import { bech32m } from 'bech32';
import secp256k1 from 'secp256k1';
import { Buffer } from 'buffer';

export const encodeSilentPaymentAddress = (
    scanKey: Uint8Array,
    spendKey: Uint8Array,
    hrp: string = 'tsp',
    version: number = 0,
): string => {
    const data = bech32m.toWords(Buffer.concat([scanKey, spendKey]));
    data.unshift(version);

    return bech32m.encode(hrp, data, 116);
};

export const decodeSilentPaymentAddress = (
    address: string,
    hrp: string = 'tsp',
): { scanKey: Buffer; spendKey: Buffer } => {
    const { prefix, words } = bech32m.decode(address, 1023);
    if (prefix != hrp) throw new Error('Invalid prefix!');

    const version = words.shift();
    if (version != 0) throw new Error('Invalid version!');

    const key = Buffer.from(bech32m.fromWords(words));

    return {
        scanKey: key.slice(0, 33),
        spendKey: key.slice(33),
    };
};

export const createLabeledSilentPaymentAddress = (
    scanKey: Uint8Array,
    spendKey: Uint8Array,
    m: Buffer,
    hrp: string = 'tsp',
    version: number = 0,
) => {
    spendKey = secp256k1.publicKeyTweakAdd(spendKey, m, true);
    return encodeSilentPaymentAddress(scanKey, spendKey, hrp, version);
};
