import { Outpoint, PrivateKey } from './interface';
import secp256k1 from 'secp256k1';
import createHash from 'create-hash';
import {
    fromHex,
    concat,
    reverse,
    createView,
} from '../../../helpers/uint8array.js';

export const createInputHash = (
    sumOfInputPublicKeys: Uint8Array,
    outpoint: Outpoint,
): Uint8Array => {
    return createTaggedHash(
        'BIP0352/Inputs',
        concat([
            concat([
                reverse(fromHex(outpoint.txid)),
                serialiseUint32LE(outpoint.vout),
            ]),
            sumOfInputPublicKeys,
        ]),
    );
};

export const createTaggedHash = (
    tag: string,
    buffer: Uint8Array,
): Uint8Array => {
    const tagHash = createHash('sha256').update(tag, 'utf8').digest();
    return new Uint8Array(
        createHash('sha256')
            .update(tagHash)
            .update(tagHash)
            .update(buffer)
            .digest(),
    );
};

export const calculateSumOfPrivateKeys = (keys: PrivateKey[]): Uint8Array => {
    const negatedKeys = keys.map((key) => {
        const privateKey = fromHex(key.key);
        if (
            key.isXOnly &&
            secp256k1.publicKeyCreate(privateKey, true)[0] === 0x03
        ) {
            return secp256k1.privateKeyNegate(privateKey);
        }
        return privateKey;
    });

    return new Uint8Array(
        negatedKeys.slice(1).reduce((acc, key) => {
            return secp256k1.privateKeyTweakAdd(acc, key);
        }, negatedKeys[0]),
    );
};

export const serialiseUint32 = (n: number): Uint8Array => {
    const buf = new Uint8Array(4);
    createView(buf).setUint32(0, n, false); // big-endian
    return buf;
};

const serialiseUint32LE = (n: number): Uint8Array => {
    const buf = new Uint8Array(4);
    createView(buf).setUint32(0, n, true); // little-endian
    return buf;
};

export const readVarInt = (buffer: Uint8Array, offset: number = 0): number => {
    const view = createView(buffer, offset);
    const first = buffer[offset];

    // 8 bit
    if (first < 0xfd) return first;
    // 16 bit
    else if (first === 0xfd) return view.getUint16(1, true);
    // 32 bit
    else if (first === 0xfe) return view.getUint32(1, true);
    // 64 bit
    else {
        const lo = view.getUint32(1, true);
        const hi = view.getUint32(5, true);
        return hi * 0x0100000000 + lo;
    }
};

export const encodingLength = (n: number) => {
    return n < 0xfd ? 1 : n <= 0xffff ? 3 : n <= 0xffffffff ? 5 : 9;
};

export const isPubKey = (testVector: Uint8Array): boolean => {
    return (
        (testVector.length == 33 || testVector.length == 65) &&
        secp256k1.publicKeyVerify(testVector)
    );
};
