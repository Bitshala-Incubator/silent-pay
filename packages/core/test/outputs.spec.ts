import { createOutputs, Outpoint, PrivateKey, RecipientAddress } from '../src';
import { testData } from './fixtures/outputs';

describe('Outputs', () => {
    it.each(testData)(
        'should create silent payments public keys',
        (data: {
            privateKeys: PrivateKey[];
            outpoints: Outpoint[];
            recipientAddresses: RecipientAddress[];
            expected: { pubkey: string; value: number }[];
        }) => {
            const outputs = createOutputs(
                data.privateKeys,
                data.outpoints,
                data.recipientAddresses,
            );
            expect(
                outputs
                    .map((output) => ({
                        pubkey: output.script.toString('hex'),
                        value: output.value,
                    }))
                    .sort((a, b) => a.pubkey.localeCompare(b.pubkey)),
            ).toStrictEqual(
                data.expected.sort((a, b) => a.pubkey.localeCompare(b.pubkey)),
            );
        },
    );
});