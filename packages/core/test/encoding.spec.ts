import {
    createLabeledSilentPaymentAddress,
    decodeSilentPaymentAddress,
    encodeSilentPaymentAddress,
} from '../src';
import { Buffer } from 'buffer';
import { unlabelled, labelled } from './fixtures/encoding';

describe('Encoding', () => {
    describe.each(unlabelled)('Encode/Decode SP', (data) => {
        it('should encode scan and spend key to silent payment address', () => {
            expect(
                encodeSilentPaymentAddress(
                    Buffer.from(data.scanKey, 'hex'),
                    Buffer.from(data.spendKey, 'hex'),
                ),
            ).toBe(data.address);
        });

        it('should decode scan and spend key from silent payment address', () => {
            expect(decodeSilentPaymentAddress(data.address)).toStrictEqual({
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
                ),
            ).toBe(data.address);
        },
    );
});
