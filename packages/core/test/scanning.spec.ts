import { LabelMap, scanOutputs, scanOutputsWithTweak } from '../src';
import { Buffer } from 'buffer';
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
                Buffer.from(scanPrivateKey, 'hex'),
                Buffer.from(spendPublicKey, 'hex'),
                Buffer.from(sumOfInputPublicKeys, 'hex'),
                Buffer.from(inputHash, 'hex'),
                outputs.map((output) => Buffer.from(output, 'hex')),
                labels as LabelMap,
            );

            expect(result).toStrictEqual(
                new Map(
                    Object.entries(expected).map(([output, tweak]) => [
                        output,
                        Buffer.from(tweak as string, 'hex'),
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
                Buffer.from(scanPrivateKey, 'hex'),
                Buffer.from(spendPublicKey, 'hex'),
                Buffer.from(tweak, 'hex'),
                outputs.map((o) => Buffer.from(o, 'hex')),
            );

            if (!expectedTweakHex) {
                expect(res.size).toBe(0);
            } else {
                expect(res.size).toBeGreaterThan(0);
                for (const [output, foundTweak] of res) {
                    expect(foundTweak.toString('hex')).toBe(expectedTweakHex);
                    expect(output).toBeDefined();
                }
            }
        },
    );
});
