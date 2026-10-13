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

describe('Scanning: caller-owned arguments', () => {
    // The vectors above decode a fresh key for every call, so a function that
    // tweaks the caller's buffer in place still satisfies them. These do not:
    // they hold on to the arguments and check them after the call.
    //
    // Note that `outputs` is deliberately spliced as matches are found, so only
    // the contents of each output buffer are checked here, not the array.
    const snapshot = (...buffers: Uint8Array[]): string[] =>
        buffers.map((buffer) => toHex(buffer));

    const simpleVector = testData[0];
    const labelledVector = testData[12];

    const expectScanOutputsLeavesArgumentsUnchanged = (
        vector: typeof simpleVector | typeof labelledVector,
    ) => {
        const scanPrivateKey = fromHex(vector.scanPrivateKey);
        const spendPublicKey = fromHex(vector.spendPublicKey);
        const sumOfInputPublicKeys = fromHex(vector.sumOfInputPublicKeys);
        const inputHash = fromHex(vector.inputHash);
        const outputs = vector.outputs.map((output) => fromHex(output));

        const before = snapshot(
            scanPrivateKey,
            spendPublicKey,
            sumOfInputPublicKeys,
            inputHash,
            ...outputs,
        );

        const matches = scanOutputs(
            scanPrivateKey,
            spendPublicKey,
            sumOfInputPublicKeys,
            inputHash,
            [...outputs],
            vector.labels as LabelMap,
        );

        expect(matches.size).toBeGreaterThan(0);
        expect(
            snapshot(
                scanPrivateKey,
                spendPublicKey,
                sumOfInputPublicKeys,
                inputHash,
                ...outputs,
            ),
        ).toEqual(before);
    };

    it('scanOutputs leaves its arguments unchanged', () => {
        expectScanOutputsLeavesArgumentsUnchanged(simpleVector);
    });

    it('scanOutputs leaves its arguments unchanged when labels match', () => {
        // guards the index above: this vector has to exercise the label path
        expect(Object.keys(labelledVector.labels).length).toBeGreaterThan(0);
        expectScanOutputsLeavesArgumentsUnchanged(labelledVector);
    });

    it('scanOutputs returns the same matches when a scan key is reused', () => {
        const scanPrivateKey = fromHex(simpleVector.scanPrivateKey);
        const spendPublicKey = fromHex(simpleVector.spendPublicKey);
        const sumOfInputPublicKeys = fromHex(simpleVector.sumOfInputPublicKeys);
        const inputHash = fromHex(simpleVector.inputHash);
        const outputs = simpleVector.outputs.map((output) => fromHex(output));

        const first = scanOutputs(
            scanPrivateKey,
            spendPublicKey,
            sumOfInputPublicKeys,
            inputHash,
            [...outputs],
        );
        const second = scanOutputs(
            scanPrivateKey,
            spendPublicKey,
            sumOfInputPublicKeys,
            inputHash,
            [...outputs],
        );

        expect(first.size).toBeGreaterThan(0);
        expect(second).toStrictEqual(first);
    });

    it('scanOutputsWithTweak leaves its arguments unchanged', () => {
        const vector = scanTweakVectors[0];
        const scanPrivateKey = fromHex(vector.scanPrivateKey);
        const spendPublicKey = fromHex(vector.spendPublicKey);
        const tweak = fromHex(vector.tweak);
        const outputs = vector.outputs.map((output) => fromHex(output));

        const before = snapshot(
            scanPrivateKey,
            spendPublicKey,
            tweak,
            ...outputs,
        );

        scanOutputsWithTweak(scanPrivateKey, spendPublicKey, tweak, [
            ...outputs,
        ]);

        expect(
            snapshot(scanPrivateKey, spendPublicKey, tweak, ...outputs),
        ).toEqual(before);
    });
});
