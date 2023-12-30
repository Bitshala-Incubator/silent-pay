import { Outpoint, Output, PrivateKey, RecipientAddress } from './interface.ts';
import {
    calculateSumOfPrivateKeys,
    hashOutpoints,
    serialiseUint32,
} from './utility.ts';
import { decodeSilentPaymentAddress } from './encoding.ts';
import secp256k1 from 'secp256k1';
import createHash from 'create-hash';
import { Buffer } from 'buffer';

export const createOutputs = (
    inputPrivateKeys: PrivateKey[],
    outpoints: Outpoint[],
    recipientAddresses: RecipientAddress[],
    hrp: string = 'tsp',
): Output[] => {
    const sumOfPrivateKeys = calculateSumOfPrivateKeys(inputPrivateKeys);
    const outpointHash = hashOutpoints(outpoints);

    const paymentGroups = new Map<
        string,
        { spendKey: Buffer; amount: number }[]
    >();

    for (const { address, amount } of recipientAddresses) {
        const { scanKey, spendKey } = decodeSilentPaymentAddress(address, hrp);
        if (paymentGroups.has(scanKey.toString('hex'))) {
            paymentGroups
                .get(scanKey.toString('hex'))
                ?.push({ spendKey, amount });
        } else {
            paymentGroups.set(scanKey.toString('hex'), [{ spendKey, amount }]);
        }
    }

    const outputs: Output[] = [];
    for (const [scanKeyHex, paymentGroup] of paymentGroups.entries()) {
        const scanKey = Buffer.from(scanKeyHex, 'hex');
        const ecdhSecret = secp256k1.publicKeyTweakMul(
            secp256k1.publicKeyTweakMul(scanKey, outpointHash, true),
            sumOfPrivateKeys,
        );

        let n = 0;
        for (const { spendKey, amount } of paymentGroup) {
            const tweak = createHash('sha256')
                .update(Buffer.concat([ecdhSecret, serialiseUint32(n)]))
                .digest();

            const publicKey = secp256k1.publicKeyTweakAdd(
                spendKey,
                tweak,
                true,
            );

            outputs.push({
                script: Buffer.from(publicKey),
                value: amount,
            });
            n++;
        }
    }

    return outputs;
};
