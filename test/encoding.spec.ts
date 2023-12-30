import {
    createLabeledSilentPaymentAddress,
    decodeSilentPaymentAddress,
    encodeSilentPaymentAddress,
} from '../src/core/encoding';
import { Buffer } from 'buffer';
import { unlabelled, labelled } from './fixtures/encoding';

describe('Encoding', () => {
    describe.each(unlabelled)('Encode/Decode SP', (data) => {
        it('should encode scan and spend key to silent payment address', () => {
            expect(
                encodeSilentPaymentAddress(
                    Buffer.from(data.scanKey, 'hex'),
                    Buffer.from(data.spendKey, 'hex'),
                    'sp',
                ),
            ).toBe(data.address);
        });

        it('should decode scan and spend key from silent payment address', () => {
            expect(
                decodeSilentPaymentAddress(data.address, 'sp'),
            ).toStrictEqual({
                scanKey: Buffer.from(data.scanKey, 'hex'),
                spendKey: Buffer.from(data.spendKey, 'hex'),
            });
        });
    });

    it.each(labelled)(
        'should create a labeled silent payment address',
        (data) => {
            expect(
                createLabeledSilentPaymentAddress(
                    Buffer.from(data.scanKey, 'hex'),
                    Buffer.from(data.spendKey, 'hex'),
                    Buffer.from(data.label, 'hex'),
                    'sp',
                ),
            ).toBe(data.address);
        },
    );
});
