import { scanOutputs } from '../src/core';
import { LabelMap } from '../src/core/interface';
import { Buffer } from 'buffer';
import { testData } from './fixtures/scanning';

describe('Scanning', () => {
    it.each(testData)(
        'should pass',
        ({
            scanPrivateKey,
            spendPublicKey,
            sumOfInputPublicKeys,
            outpointHash,
            outputs,
            labels,
            matches,
        }) => {
            const result = scanOutputs(
                Buffer.from(scanPrivateKey, 'hex'),
                Buffer.from(spendPublicKey, 'hex'),
                Buffer.from(sumOfInputPublicKeys, 'hex'),
                Buffer.from(outpointHash, 'hex'),
                outputs.map((output) => Buffer.from(output, 'hex')),
                labels as unknown as LabelMap,
            );

            expect(result).toStrictEqual(
                new Map(
                    Object.entries(matches).map(([output, tweak]) => [
                        output,
                        Buffer.from(tweak as string, 'hex'),
                    ]),
                ),
            );
        },
    );
});
