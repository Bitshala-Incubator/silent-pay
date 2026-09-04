import {
    createLabeledSilentPaymentAddress,
    decodeSilentPaymentAddress,
    encodeSilentPaymentAddress,
    parseSilentBlock,
    fromHex,
} from '../src';
import { bech32m } from 'bech32';
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
            expect(decoded.version).toBe(0);
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

    describe('decodeSilentPaymentAddress validation', () => {
        // Valid keys from the first fixture for reuse
        const validScanKey = fromHex(
            '03b4cc0b090b6f49a684558852db60ee5eb1c5f74352839c3d18a8fc04ef7354e0',
        );
        const validSpendKey = fromHex(
            '03bc95144daf15336db3456825c70ced0a4462f89aca42c4921ee7ccb2b3a44796',
        );
        const validPayload = new Uint8Array([
            ...validScanKey,
            ...validSpendKey,
        ]);

        /** Encode a custom payload with a specific version and HRP */
        function encodeCustomAddress(
            hrp: string,
            version: number,
            payload: Uint8Array,
        ): string {
            const words = bech32m.toWords(payload);
            words.unshift(version);
            return bech32m.encode(hrp, words, 1023);
        }

        it('should decode a valid v0 address and return version 0', () => {
            const addr = encodeCustomAddress('sp', 0, validPayload);
            const decoded = decodeSilentPaymentAddress(addr);
            expect(decoded.version).toBe(0);
            expect(decoded.scanKey).toEqual(validScanKey);
            expect(decoded.spendKey).toEqual(validSpendKey);
        });

        it('should reject v0 address with payload shorter than 66 bytes', () => {
            const shortPayload = validPayload.slice(0, 60);
            const addr = encodeCustomAddress('sp', 0, shortPayload);
            expect(() => decodeSilentPaymentAddress(addr)).toThrow(
                'Invalid payload length for version 0!',
            );
        });

        it('should reject v0 address with payload longer than 66 bytes', () => {
            const longPayload = new Uint8Array([
                ...validPayload,
                0x00,
                0x00,
            ]);
            const addr = encodeCustomAddress('sp', 0, longPayload);
            expect(() => decodeSilentPaymentAddress(addr)).toThrow(
                'Invalid payload length for version 0!',
            );
        });

        it('should accept v1 address with exactly 66 bytes (forward-compatible)', () => {
            const addr = encodeCustomAddress('sp', 1, validPayload);
            const decoded = decodeSilentPaymentAddress(addr);
            expect(decoded.version).toBe(1);
            expect(decoded.scanKey).toEqual(validScanKey);
            expect(decoded.spendKey).toEqual(validSpendKey);
        });

        it('should accept v1 address with extra data beyond 66 bytes', () => {
            const extendedPayload = new Uint8Array([
                ...validPayload,
                0xab,
                0xcd,
                0xef,
            ]);
            const addr = encodeCustomAddress('sp', 1, extendedPayload);
            const decoded = decodeSilentPaymentAddress(addr);
            expect(decoded.version).toBe(1);
            expect(decoded.scanKey).toEqual(validScanKey);
            expect(decoded.spendKey).toEqual(validSpendKey);
        });

        it('should reject v1 address with payload shorter than 66 bytes', () => {
            const shortPayload = validPayload.slice(0, 50);
            const addr = encodeCustomAddress('sp', 1, shortPayload);
            expect(() => decodeSilentPaymentAddress(addr)).toThrow(
                'Payload too short!',
            );
        });

        it('should reject version 31 address', () => {
            const addr = encodeCustomAddress('sp', 31, validPayload);
            expect(() => decodeSilentPaymentAddress(addr)).toThrow(
                'Unsupported version!',
            );
        });

        it('should reject address with invalid scan public key', () => {
            const badScanKey = new Uint8Array(33).fill(0x00);
            const badPayload = new Uint8Array([
                ...badScanKey,
                ...validSpendKey,
            ]);
            const addr = encodeCustomAddress('sp', 0, badPayload);
            expect(() => decodeSilentPaymentAddress(addr)).toThrow(
                'Invalid scan public key!',
            );
        });

        it('should reject address with invalid spend public key', () => {
            const badSpendKey = new Uint8Array(33).fill(0xff);
            const badPayload = new Uint8Array([
                ...validScanKey,
                ...badSpendKey,
            ]);
            const addr = encodeCustomAddress('sp', 0, badPayload);
            expect(() => decodeSilentPaymentAddress(addr)).toThrow(
                'Invalid spend public key!',
            );
        });

        it('should reject address with wrong network prefix', () => {
            const addr = encodeCustomAddress('tsp', 0, validPayload);
            expect(() => decodeSilentPaymentAddress(addr)).toThrow(
                'Invalid prefix!',
            );
        });
    });
});
