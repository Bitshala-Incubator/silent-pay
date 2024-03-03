import { createTaggedHash, serialiseUint32 } from './utility.ts';
import { LabelMap } from './interface.ts';
import secp256k1 from 'secp256k1';
import { Buffer } from 'buffer';

// Handle additional label-related logic
const handleLabels = (
    output: Buffer,
    tweakedPublicKey: Uint8Array,
    tweak: Buffer,
    labels: LabelMap,
): Uint8Array | null => {
    const negatedPublicKey = secp256k1.publicKeyNegate(tweakedPublicKey, true);

    let mG = secp256k1.publicKeyCombine([output, negatedPublicKey], true);
    let labelHex = labels[Buffer.from(mG).toString('hex')];
    if (!labelHex) {
        mG = secp256k1.publicKeyCombine(
            [secp256k1.publicKeyNegate(output, true), negatedPublicKey],
            true,
        );
        labelHex = labels[Buffer.from(mG).toString('hex')];
    }

    if (labelHex) {
        return secp256k1.privateKeyTweakAdd(
            tweak,
            Buffer.from(labelHex, 'hex'),
        );
    }

    return null;
};

const processTweak = (
    spendPublicKey: Buffer,
    tweak: Buffer,
    outputs: Buffer[],
    matches: Map<string, Buffer>,
    labels?: LabelMap,
): number => {
    const tweakedPublicKey = secp256k1.publicKeyTweakAdd(
        spendPublicKey,
        tweak,
        true,
    );

    for (let i = 0; i < outputs.length; i++) {
        const output = outputs[i];

        if (output.subarray(1).equals(tweakedPublicKey.subarray(1))) {
            matches.set(output.toString('hex'), tweak);
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
                matches.set(
                    output.toString('hex'),
                    Buffer.from(privateKeyTweak),
                );
                return 1; // Increment counter
            }
        }
    }

    return 0; // No counter increment
};

export const scanOutputs = (
    scanPrivateKey: Buffer,
    spendPublicKey: Buffer,
    sumOfInputPublicKeys: Buffer,
    inputHash: Buffer,
    outputs: Buffer[],
    labels?: LabelMap,
): Map<string, Buffer> => {
    const ecdhSecret = secp256k1.publicKeyTweakMul(
        sumOfInputPublicKeys,
        secp256k1.privateKeyTweakMul(scanPrivateKey, inputHash),
        true,
    );

    // output to tweak data map
    const matches = new Map<string, Buffer>();
    let n = 0;
    let counterIncrement = 0;

    do {
        const tweak = createTaggedHash(
            'BIP0352/SharedSecret',
            Buffer.concat([ecdhSecret, serialiseUint32(n)]),
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
};
