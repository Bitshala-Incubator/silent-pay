import {
    readVarInt,
    encodingLength,
    serialiseUint32,
    isPubKey,
    fromHex,
} from '../src';

describe('Utility - VarInt, Serialization & PubKey', () => {
    describe('readVarInt', () => {
        it('reads 1-byte varint values (< 0xfd)', () => {
            expect(readVarInt(new Uint8Array([0x00]))).toBe(0);
            expect(readVarInt(new Uint8Array([0x01]))).toBe(1);
            expect(readVarInt(new Uint8Array([0x2a]))).toBe(42);
            expect(readVarInt(new Uint8Array([0xfc]))).toBe(252);
        });

        it('reads 2-byte (16-bit) varint values prefixed with 0xfd', () => {
            // 253 = 0xfd 0xfd 0x00 (little endian 253)
            expect(readVarInt(new Uint8Array([0xfd, 0xfd, 0x00]))).toBe(253);
            // 512 = 0x0200 -> little endian: 00 02
            expect(readVarInt(new Uint8Array([0xfd, 0x00, 0x02]))).toBe(512);
            // 65535 (0xffff) -> little endian: ff ff
            expect(readVarInt(new Uint8Array([0xfd, 0xff, 0xff]))).toBe(65535);
        });

        it('reads 4-byte (32-bit) varint values prefixed with 0xfe', () => {
            // 65536 = 0x00010000 -> little endian: 00 00 01 00
            expect(
                readVarInt(new Uint8Array([0xfe, 0x00, 0x00, 0x01, 0x00])),
            ).toBe(65536);
            // 1,000,000 = 0x000f4240 -> little endian: 40 42 0f 00
            expect(
                readVarInt(new Uint8Array([0xfe, 0x40, 0x42, 0x0f, 0x00])),
            ).toBe(1000000);
            // 4294967295 (0xffffffff)
            expect(
                readVarInt(new Uint8Array([0xfe, 0xff, 0xff, 0xff, 0xff])),
            ).toBe(4294967295);
        });

        it('reads 8-byte (64-bit) varint values prefixed with 0xff', () => {
            // 4294967296 = 2^32 -> lo: 0x00000000, hi: 0x00000001
            expect(
                readVarInt(
                    new Uint8Array([
                        0xff, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00,
                    ]),
                ),
            ).toBe(4294967296);

            // 10,000,000,000 -> 0x00000002540be400
            // lo: 0x540be400 (little-endian: 00 e4 0b 54)
            // hi: 0x00000002 (little-endian: 02 00 00 00)
            expect(
                readVarInt(
                    new Uint8Array([
                        0xff, 0x00, 0xe4, 0x0b, 0x54, 0x02, 0x00, 0x00, 0x00,
                    ]),
                ),
            ).toBe(10000000000);
        });

        it('reads varint with custom buffer offset', () => {
            const buf = new Uint8Array([0xaa, 0xbb, 0xfd, 0x2c, 0x01]);
            // at offset 2: 0xfd, 0x2c, 0x01 = 300
            expect(readVarInt(buf, 2)).toBe(300);
        });
    });

    describe('encodingLength', () => {
        it('returns correct varint byte lengths for boundary values', () => {
            expect(encodingLength(0)).toBe(1);
            expect(encodingLength(252)).toBe(1);
            expect(encodingLength(253)).toBe(3);
            expect(encodingLength(65535)).toBe(3);
            expect(encodingLength(65536)).toBe(5);
            expect(encodingLength(4294967295)).toBe(5);
            expect(encodingLength(4294967296)).toBe(9);
            expect(encodingLength(10000000000)).toBe(9);
        });
    });

    describe('serialiseUint32', () => {
        it('serialises 32-bit unsigned integer to 4-byte big-endian buffer', () => {
            // 1 = 0x00000001
            expect(serialiseUint32(1)).toEqual(
                new Uint8Array([0x00, 0x00, 0x00, 0x01]),
            );
            // 258 = 0x00000102
            expect(serialiseUint32(258)).toEqual(
                new Uint8Array([0x00, 0x00, 0x01, 0x02]),
            );
            // 305419896 = 0x12345678
            expect(serialiseUint32(0x12345678)).toEqual(
                new Uint8Array([0x12, 0x34, 0x56, 0x78]),
            );
        });
    });

    describe('isPubKey validation', () => {
        it('validates compressed secp256k1 public keys', () => {
            // 33 bytes starting with 0x02 or 0x03
            const key02 = fromHex(
                '0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798',
            );
            const key03 = fromHex(
                '03bc95144daf15336db3456825c70ced0a4462f89aca42c4921ee7ccb2b3a44796',
            );
            expect(isPubKey(key02)).toBe(true);
            expect(isPubKey(key03)).toBe(true);
        });

        it('rejects keys with invalid length or prefix', () => {
            // wrong length (32 bytes instead of 33)
            expect(isPubKey(new Uint8Array(32))).toBe(false);
            // wrong length (65 bytes uncompressed)
            expect(isPubKey(new Uint8Array(65))).toBe(false);
            // 33 bytes but invalid prefix (0x04 or 0x00)
            const invalidPrefix = new Uint8Array(33);
            invalidPrefix[0] = 0x04;
            expect(isPubKey(invalidPrefix)).toBe(false);
        });
    });
});
