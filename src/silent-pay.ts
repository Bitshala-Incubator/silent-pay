import HDPrivateKey from 'bcoin/dist/hd/private';
import { bech32m } from 'bech32';

export const deriveSilentPaymentsKeyPair = (
    master: HDPrivateKey,
): { scanKey: HDPrivateKey; spendKey: HDPrivateKey } => {
    if (master.depth != 0 || master.parentFingerPrint != 0)
        throw new Error('Bad master key!');

    return {
        scanKey: master.derivePath('m/352h/0h/0h/1h/0'),
        spendKey: master.derivePath('m/352h/0h/0h/0h/0'),
    };
};

export const encodeSilentPaymentAddress = (
    scanKey: Buffer,
    spendKey: Buffer,
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
    const { prefix, words } = bech32m.decode(address, 116);
    if (prefix != hrp) throw new Error('Invalid prefix!');

    const version = words.shift();
    if (version != 0) throw new Error('Invalid version!');

    const key = Buffer.from(bech32m.fromWords(words));

    return {
        scanKey: key.slice(0, 33),
        spendKey: key.slice(33),
    };
};
