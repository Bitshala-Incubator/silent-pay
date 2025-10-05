import { Outpoint, Output, PrivateKey, RecipientAddress } from './interface.ts';
import {
    calculateSumOfPrivateKeys,
    createInputHash,
    createTaggedHash,
    serialiseUint32,
} from './utility.ts';
import { decodeSilentPaymentAddress } from './encoding.ts';
import secp256k1 from 'secp256k1';
import { toHex, concat } from './bytes.ts';
import { bitcoin } from 'bitcoinjs-lib/src/networks';
import { Network } from 'bitcoinjs-lib';

export const createOutputs = (
    inputPrivateKeys: PrivateKey[],
    smallestOutpoint: Outpoint,
    recipientAddresses: RecipientAddress[],
    network: Network = bitcoin,
): Output[] => {
    const sumOfPrivateKeys = calculateSumOfPrivateKeys(inputPrivateKeys);
    const inputHash = createInputHash(
        new Uint8Array(secp256k1.publicKeyCreate(sumOfPrivateKeys)),
        smallestOutpoint,
    );

    const paymentGroups = new Map<
        string,
        { spendKey: Uint8Array; amount: number }[]
    >();

    for (const { address, amount } of recipientAddresses) {
        const { scanKey, spendKey } = decodeSilentPaymentAddress(
            address,
            network,
        );
        if (paymentGroups.has(toHex(scanKey))) {
            paymentGroups
                .get(toHex(scanKey))
                ?.push({ spendKey, amount });
        } else {
            paymentGroups.set(toHex(scanKey), [{ spendKey, amount }]);
        }
    }

    const outputs: Output[] = [];
    for (const [scanKeyHex, paymentGroup] of paymentGroups.entries()) {
        const scanKey = new Uint8Array(scanKeyHex.length / 2);
        for (let i = 0; i < scanKeyHex.length; i += 2) {
            scanKey[i / 2] = parseInt(scanKeyHex.substr(i, 2), 16);
        }
        const ecdhSecret = secp256k1.publicKeyTweakMul(
            secp256k1.publicKeyTweakMul(scanKey, inputHash, true),
            sumOfPrivateKeys,
        );

        let n = 0;
        for (const { spendKey, amount } of paymentGroup) {
            const tweak = createTaggedHash(
                'BIP0352/SharedSecret',
                concat([new Uint8Array(ecdhSecret), serialiseUint32(n)]),
            );

            const publicKey = secp256k1.publicKeyTweakAdd(
                spendKey,
                tweak,
                true,
            );

            outputs.push({
                script: new Uint8Array(publicKey),
                value: amount,
            });
            n++;
        }
    }

    return outputs;
};
