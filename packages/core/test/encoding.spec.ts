import {
    createLabeledSilentPaymentAddress,
    decodeSilentPaymentAddress,
    encodeSilentPaymentAddress,
    parseSilentBlock,
    fromHex,
} from '../src';
import { unlabelled, labelled, silentBlock } from './fixtures/encoding';

describe('Encoding', () => {
    describe.each(unlabelled)('Encode/Decode SP', (data) => {
        it('should encode scan and spend key to silent payment address', () => {
            expect(
                encodeSilentPaymentAddress(
                    fromHex(data.scanKey),
                    fromHex(data.spendKey),
                ),
            ).toBe(data.address);
        });

        it('should decode scan and spend key from silent payment address', () => {
            const decoded = decodeSilentPaymentAddress(data.address);
            expect(decoded.scanKey).toEqual(fromHex(data.scanKey));
            expect(decoded.spendKey).toEqual(fromHex(data.spendKey));
        });
    });

    it.each(labelled)(
        'should create a labeled silent payment address',
        ({ scanPrivKey, spendPubKey, label, address }) => {
            expect(
                createLabeledSilentPaymentAddress(
                    fromHex(scanPrivKey),
                    fromHex(spendPubKey),
                    label,
                ),
            ).toBe(address);
        },
    );

    it.each(silentBlock)('should parse silent block', (blockData) => {
        const parsedBlock = parseSilentBlock(
            fromHex(blockData.encodedBlockHex),
        );
        expect(parsedBlock).toStrictEqual(blockData.parsedBlock);
    });
});
