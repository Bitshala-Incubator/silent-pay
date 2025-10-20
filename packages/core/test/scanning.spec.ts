import {
    LabelMap,
    scanOutputs,
    scanOutputsWithTweak,
    fromHex,
    toHex,
} from '../src';
import { testData, scanTweakVectors } from './fixtures/scanning';

describe('Scanning', () => {
    it.each(testData)(
        'should scan outputs and return the expected tweaks: $description',
        ({
            scanPrivateKey,
            spendPublicKey,
            sumOfInputPublicKeys,
            inputHash,
            outputs,
            labels,
            expected,
        }) => {
            const result = scanOutputs(
                fromHex(scanPrivateKey),
                fromHex(spendPublicKey),
                fromHex(sumOfInputPublicKeys),
                fromHex(inputHash),
                outputs.map((output) => fromHex(output)),
                labels as LabelMap,
            );

            expect(result).toStrictEqual(
                new Map(
                    Object.entries(expected).map(([output, tweak]) => [
                        output,
                        fromHex(tweak as string),
                    ]),
                ),
            );
        },
    );

    it.each(scanTweakVectors)(
        'should scan using scan tweak - $description',
        ({
            scanPrivateKey,
            spendPublicKey,
            tweak,
            outputs,
            expectedTweakHex,
        }) => {
            const res = scanOutputsWithTweak(
                fromHex(scanPrivateKey),
                fromHex(spendPublicKey),
                fromHex(tweak),
                outputs.map((o) => fromHex(o)),
            );

            if (!expectedTweakHex) {
                expect(res.size).toBe(0);
            } else {
                expect(res.size).toBeGreaterThan(0);
                for (const [output, foundTweak] of res) {
                    expect(toHex(foundTweak)).toBe(expectedTweakHex);
                    expect(output).toBeDefined();
                }
            }
        },
    );
});
