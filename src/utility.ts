import { Outpoint as BcoinOutpoint } from 'bcoin/dist/primitives';
import { Outpoint, PrivateKey } from './interface';
import { SHA256, secp256k1 } from 'bcrypto';
import HDPrivateKey from 'bcoin/dist/hd/private';

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

export const hashOutpoints = (outpoints: Outpoint[]): Buffer => {
    const bcoinOutpoints = Buffer.concat(
        outpoints
            .map((outpoint) =>
                BcoinOutpoint.fromJSON({
                    hash: outpoint.txid,
                    index: outpoint.vout,
                }).toRaw(),
            )
            .sort((a, b) => a.compare(b)),
    );

    return SHA256.digest(bcoinOutpoints);
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

    return negatedKeys.slice(1).reduce((acc, key) => {
        return secp256k1.privateKeyTweakAdd(acc, key);
    }, negatedKeys[0]);
};
