import { Outpoint, Output, PrivateKey, RecipientAddress } from './interface.ts';
import {
    calculateSumOfPrivateKeys,
    hashOutpoints,
    serialiseUint32,
} from './utility.ts';
import { decodeSilentPaymentAddress } from './encoding.ts';
import { SHA256, secp256k1 } from 'bcrypto';

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
        const ecdhSecret = secp256k1.derive(
            secp256k1.publicKeyTweakMul(scanKey, outpointHash, true),
            sumOfPrivateKeys,
            true,
        );

        let n = 0;
        for (const { spendKey, amount } of paymentGroup) {
            const tweak = SHA256.digest(
                Buffer.concat([ecdhSecret, serialiseUint32(n)]),
            );

            const publicKey = secp256k1.publicKeyTweakAdd(
                spendKey,
                tweak,
                true,
            );

            outputs.push({
                pubkey: publicKey,
                value: amount,
            });
            n++;
        }
    }

    return outputs;
};
