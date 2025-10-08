import { Outpoint, PrivateKey } from './interface';
import secp256k1 from 'secp256k1';
import createHash from 'create-hash';
import { Buffer } from 'buffer';

export const createInputHash = (
    sumOfInputPublicKeys: Buffer,
    outpoint: Outpoint,
): Buffer => {
    return createTaggedHash(
        'BIP0352/Inputs',
        Buffer.concat([
            Buffer.concat([
                Buffer.from(outpoint.txid, 'hex').reverse(),
                serialiseUint32LE(outpoint.vout),
            ]),
            sumOfInputPublicKeys,
        ]),
    );
};

export const createTaggedHash = (tag: string, buffer: Buffer): Buffer => {
    const tagHash = createHash('sha256').update(tag, 'utf8').digest();
    return createHash('sha256')
        .update(tagHash)
        .update(tagHash)
        .update(buffer)
        .digest();
};

export const calculateSumOfPrivateKeys = (keys: PrivateKey[]): Buffer => {
    const negatedKeys = keys.map((key) => {
        const privateKey = Buffer.from(key.key, 'hex');
        if (
            key.isXOnly &&
            secp256k1.publicKeyCreate(privateKey, true)[0] === 0x03
        ) {
            return secp256k1.privateKeyNegate(privateKey);
        }
        return privateKey;
    });

    return Buffer.from(
        negatedKeys.slice(1).reduce((acc, key) => {
            return secp256k1.privateKeyTweakAdd(acc, key);
        }, negatedKeys[0]),
    );
};

export const serialiseUint32 = (n: number): Buffer => {
    const buf = Buffer.alloc(4);
    buf.writeUInt32BE(n);
    return buf;
};

const serialiseUint32LE = (n: number): Buffer => {
    const buf = Buffer.alloc(4);
    buf.writeUInt32LE(n);
    return buf;
};

export const readVarInt = (buffer: Buffer, offset: number = 0): number => {
    const first = buffer.readUInt8(offset);

    // 8 bit
    if (first < 0xfd) return first;
    // 16 bit
    else if (first === 0xfd) return buffer.readUInt16LE(offset + 1);
    // 32 bit
    else if (first === 0xfe) return buffer.readUInt32LE(offset + 1);
    // 64 bit
    else {
        const lo = buffer.readUInt32LE(offset + 1);
        const hi = buffer.readUInt32LE(offset + 5);
        return hi * 0x0100000000 + lo;
    }
};

export const encodingLength = (n: number) => {
    return n < 0xfd ? 1 : n <= 0xffff ? 3 : n <= 0xffffffff ? 5 : 9;
};

export const isPubKey = (testVector: Buffer): boolean => {
    return (
        (testVector.length == 33 || testVector.length == 65) &&
        secp256k1.publicKeyVerify(testVector)
    );
};
