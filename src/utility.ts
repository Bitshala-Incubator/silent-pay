import { Outpoint, PrivateKey } from './interface';
import secp256k1 from 'secp256k1';
import createHash from 'create-hash';
import { Buffer } from 'buffer';

export const hashOutpoints = (outpoints: Outpoint[]): Buffer => {
    const outpointBuffer = Buffer.concat(
        outpoints
            .map((outpoint) =>
                Buffer.concat([
                    Buffer.from(outpoint.txid, 'hex').reverse(),
                    serialiseUint32LE(outpoint.vout),
                ]),
            )
            .sort((a, b) => a.compare(b)),
    );

    return createHash('sha256').update(outpointBuffer).digest();
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
