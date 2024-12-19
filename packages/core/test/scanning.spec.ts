import { LabelMap, scanOutputs } from '../src';
import { Buffer } from 'buffer';
import { testData } from './fixtures/scanning';

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
});
