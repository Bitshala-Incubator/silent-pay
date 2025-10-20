import { createTaggedHash, serialiseUint32 } from './utility';
import { LabelMap } from './interface';
import secp256k1 from 'secp256k1';
import {
    fromHex,
    toHex,
    concat,
    areUint8ArraysEqual,
} from '../../../helpers/uint8array.js';

// Handle additional label-related logic
const handleLabels = (
    output: Uint8Array,
    tweakedPublicKey: Uint8Array,
    tweak: Uint8Array,
    labels: LabelMap,
): Uint8Array | null => {
    const negatedPublicKey = secp256k1.publicKeyNegate(tweakedPublicKey, true);

    let mG = secp256k1.publicKeyCombine([output, negatedPublicKey], true);
    let labelHex = labels[toHex(mG)];
    if (!labelHex) {
        mG = secp256k1.publicKeyCombine(
            [secp256k1.publicKeyNegate(output, true), negatedPublicKey],
            true,
        );
        labelHex = labels[toHex(mG)];
    }

    if (labelHex) {
        return secp256k1.privateKeyTweakAdd(tweak, fromHex(labelHex));
    }

    return null;
};

const processTweak = (
    spendPublicKey: Uint8Array,
    tweak: Uint8Array,
    outputs: Uint8Array[],
    matches: Map<string, Uint8Array>,
    labels?: LabelMap,
): number => {
    const tweakedPublicKey = secp256k1.publicKeyTweakAdd(
        spendPublicKey,
        tweak,
        true,
    );

    // iterate backwards to safely remove matched outputs from array
    for (let i = outputs.length - 1; i >= 0; i--) {
        const output = outputs[i];

        // Compare the x-coordinate (skip first byte which is prefix)
        const outputX = output.subarray(1);
        const tweakedX = tweakedPublicKey.subarray(1);
        if (areUint8ArraysEqual(outputX, tweakedX)) {
            matches.set(toHex(output), tweak);
            outputs.splice(i, 1);
            return 1; // Increment counter
        } else if (labels) {
            // Additional logic if labels are provided
            const privateKeyTweak = handleLabels(
                output,
                tweakedPublicKey,
                tweak,
                labels,
            );
            if (privateKeyTweak) {
                matches.set(toHex(output), new Uint8Array(privateKeyTweak));
                outputs.splice(i, 1);
                return 1; // Increment counter
            }
        }
    }

    return 0; // No counter increment
};

function scanOutputsUsingSecret(
    ecdhSecret: Uint8Array,
    spendPublicKey: Uint8Array,
    outputs: Uint8Array[],
    labels?: LabelMap,
): Map<string, Uint8Array> {
    const matches = new Map<string, Uint8Array>();
    let n = 0;
    let counterIncrement = 0;
    do {
        const tweak = createTaggedHash(
            'BIP0352/SharedSecret',
            concat([ecdhSecret, serialiseUint32(n)]),
        );
        counterIncrement = processTweak(
            spendPublicKey,
            tweak,
            outputs,
            matches,
            labels,
        );
        n += counterIncrement;
    } while (counterIncrement > 0 && outputs.length > 0);

    return matches;
}

export const scanOutputs = (
    scanPrivateKey: Uint8Array,
    spendPublicKey: Uint8Array,
    sumOfInputPublicKeys: Uint8Array,
    inputHash: Uint8Array,
    outputs: Uint8Array[],
    labels?: LabelMap,
): Map<string, Uint8Array> => {
    const ecdhSecret = secp256k1.publicKeyTweakMul(
        sumOfInputPublicKeys,
        secp256k1.privateKeyTweakMul(scanPrivateKey, inputHash),
        true,
    );

    return scanOutputsUsingSecret(ecdhSecret, spendPublicKey, outputs, labels);
};

export const scanOutputsWithTweak = (
    scanPrivateKey: Uint8Array,
    spendPublicKey: Uint8Array,
    scanTweak: Uint8Array,
    outputs: Uint8Array[],
    labels?: LabelMap,
): Map<string, Uint8Array> => {
    if (scanTweak.length === 33) {
        // Use publicKeyTweakMul for compressed pubkey
        const ecdhSecret = secp256k1.publicKeyTweakMul(
            scanTweak,
            scanPrivateKey,
            true,
        );
        return scanOutputsUsingSecret(
            ecdhSecret,
            spendPublicKey,
            outputs,
            labels,
        );
    } else {
        throw new Error(
            `Expected scanTweak to be either 33-byte compressed public key, got ${scanTweak.length}`,
        );
    }
};
