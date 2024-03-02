import { createOutputs } from '../src';
import { testData } from './fixtures/outputs';

describe('Outputs', () => {
    it.each(testData)(
        'should create silent payments public keys: $description',
        ({ privateKeys, outpoint, recipientAddresses, expected }) => {
            const outputs = createOutputs(
                privateKeys,
                outpoint,
                recipientAddresses,
            );
            expect(
                outputs
                    .map((output) => ({
                        pubkey: output.script.toString('hex'),
                        value: output.value,
                    }))
                    .sort((a, b) => a.pubkey.localeCompare(b.pubkey)),
            ).toStrictEqual(
                expected.sort((a, b) => a.pubkey.localeCompare(b.pubkey)),
            );
        },
    );
});
