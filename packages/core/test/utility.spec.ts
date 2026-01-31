import {
    calculateSumOfPrivateKeys,
    createTaggedHash,
    createInputHash,
    PrivateKey,
    isPubKey,
    fromHex,
    toHex,
    serialiseUint32,
    readVarInt,
    encodingLength,
} from '../src';
import {
    createTaggedHashData,
    createInputHashData,
    inputPrivateKeys,
    publicKeysTestData,
} from './fixtures/utility';

describe('Utility', () => {
    it.each(inputPrivateKeys)(
        'should calculate sum of private keys',
        async (data: { keys: PrivateKey[]; expected: string }) => {
            const { keys, expected } = data;
            const sum = calculateSumOfPrivateKeys(keys);
            expect(toHex(sum)).toBe(expected);
        },
    );

    it.each(createTaggedHashData)(
        'should calculate tagged hash',
        ({ tag, hex, expected }) => {
            const taggedHash = createTaggedHash(tag, fromHex(hex));
            expect(toHex(taggedHash)).toBe(expected);
        },
    );

    it.each(createInputHashData)(
        'should calculate input hash',
        ({ sumOfInputPublicKeys, outpoint, expected }) => {
            const inputHash = createInputHash(
                fromHex(sumOfInputPublicKeys),
                outpoint,
            );
            expect(toHex(inputHash)).toBe(expected);
        },
    );

    it.each(publicKeysTestData)(
        'should test for public key validity',
        ({ publickKey, valid }) => {
            expect(isPubKey(fromHex(publickKey))).toStrictEqual(valid);
        },
    );

    // Tests for individual utility functions
    describe('serialiseUint32', () => {
        it('should serialize 0 as big-endian', () => {
            const result = serialiseUint32(0);
            expect(toHex(result)).toBe('00000000');
            expect(result.length).toBe(4);
        });

        it('should serialize small numbers as big-endian', () => {
            const result = serialiseUint32(1);
            expect(toHex(result)).toBe('00000001');
        });

        it('should serialize 255 as big-endian', () => {
            const result = serialiseUint32(255);
            expect(toHex(result)).toBe('000000ff');
        });

        it('should serialize 256 as big-endian', () => {
            const result = serialiseUint32(256);
            expect(toHex(result)).toBe('00000100');
        });

        it('should serialize maximum uint32 value as big-endian', () => {
            const result = serialiseUint32(4294967295); // 0xFFFFFFFF
            expect(toHex(result)).toBe('ffffffff');
        });

        it('should serialize middle-range values correctly', () => {
            const result = serialiseUint32(16909060); // 0x01020304
            expect(toHex(result)).toBe('01020304');
        });
    });

    describe('readVarInt', () => {
        it('should read 8-bit varint (< 0xfd)', () => {
            const buffer = fromHex('01');
            expect(readVarInt(buffer)).toBe(1);
        });

        it('should read maximum 8-bit varint value', () => {
            const buffer = fromHex('fc'); // 252
            expect(readVarInt(buffer)).toBe(252);
        });

        it('should read 16-bit varint (0xfd prefix)', () => {
            const buffer = fromHex('fdfd00'); // 253 in little-endian
            expect(readVarInt(buffer)).toBe(253);
        });

        it('should read larger 16-bit varint', () => {
            const buffer = fromHex('fdffff'); // 65535 in little-endian
            expect(readVarInt(buffer)).toBe(65535);
        });

        it('should read 32-bit varint (0xfe prefix)', () => {
            const buffer = fromHex('fe00000100'); // 65536 in little-endian
            expect(readVarInt(buffer)).toBe(65536);
        });

        it('should read maximum 32-bit varint', () => {
            const buffer = fromHex('feffffffff'); // 4294967295 in little-endian
            expect(readVarInt(buffer)).toBe(4294967295);
        });

        it('should read 64-bit varint (0xff prefix)', () => {
            const buffer = fromHex('ff0000000001000000'); // 4294967296 in little-endian
            expect(readVarInt(buffer)).toBe(4294967296);
        });

        it('should read varint with offset', () => {
            const buffer = fromHex('0000fd0001'); // varint at offset 2
            expect(readVarInt(buffer, 2)).toBe(256);
        });

        it('should read zero value', () => {
            const buffer = fromHex('00');
            expect(readVarInt(buffer)).toBe(0);
        });
    });

    describe('encodingLength', () => {
        it('should return 1 for values < 0xfd', () => {
            expect(encodingLength(0)).toBe(1);
            expect(encodingLength(1)).toBe(1);
            expect(encodingLength(252)).toBe(1);
        });

        it('should return 3 for values from 0xfd to 0xffff', () => {
            expect(encodingLength(253)).toBe(3);
            expect(encodingLength(254)).toBe(3);
            expect(encodingLength(65535)).toBe(3);
        });

        it('should return 5 for values from 0x10000 to 0xffffffff', () => {
            expect(encodingLength(65536)).toBe(5);
            expect(encodingLength(16777215)).toBe(5);
            expect(encodingLength(4294967295)).toBe(5);
        });

        it('should return 9 for values > 0xffffffff', () => {
            expect(encodingLength(4294967296)).toBe(9);
            expect(encodingLength(9007199254740991)).toBe(9); // Number.MAX_SAFE_INTEGER
        });
    });

    describe('isPubKey edge cases', () => {
        it('should reject empty buffer', () => {
            const emptyBuffer = new Uint8Array(0);
            expect(isPubKey(emptyBuffer)).toBe(false);
        });

        it('should reject buffer with wrong length (32 bytes)', () => {
            const wrongLength = new Uint8Array(32).fill(0);
            expect(isPubKey(wrongLength)).toBe(false);
        });

        it('should reject buffer with wrong length (34 bytes)', () => {
            const wrongLength = new Uint8Array(34).fill(0);
            expect(isPubKey(wrongLength)).toBe(false);
        });

        it('should reject 33-byte buffer with invalid data', () => {
            const invalidKey = new Uint8Array(33).fill(0xff);
            expect(isPubKey(invalidKey)).toBe(false);
        });

        it('should reject 65-byte buffer with invalid data', () => {
            const invalidKey = new Uint8Array(65).fill(0);
            expect(isPubKey(invalidKey)).toBe(false);
        });
    });

    describe('createTaggedHash edge cases', () => {
        it('should handle empty buffer', () => {
            const result = createTaggedHash('test', new Uint8Array(0));
            expect(result.length).toBe(32);
            expect(result).toBeInstanceOf(Uint8Array);
        });

        it('should handle empty tag', () => {
            const testData = fromHex('deadbeef');
            const result = createTaggedHash('', testData);
            expect(result.length).toBe(32);
            expect(result).toBeInstanceOf(Uint8Array);
        });

        it('should produce different hashes for different tags', () => {
            const testData = fromHex('deadbeef');
            const hash1 = createTaggedHash('tag1', testData);
            const hash2 = createTaggedHash('tag2', testData);
            expect(toHex(hash1)).not.toBe(toHex(hash2));
        });

        it('should produce different hashes for different data', () => {
            const hash1 = createTaggedHash('tag', fromHex('deadbeef'));
            const hash2 = createTaggedHash('tag', fromHex('cafebabe'));
            expect(toHex(hash1)).not.toBe(toHex(hash2));
        });

        it('should produce same hash for same inputs', () => {
            const testData = fromHex('deadbeef');
            const hash1 = createTaggedHash('tag', testData);
            const hash2 = createTaggedHash('tag', testData);
            expect(toHex(hash1)).toBe(toHex(hash2));
        });
    });

    describe('calculateSumOfPrivateKeys edge cases', () => {
        it('should handle single key', () => {
            const keys: PrivateKey[] = [
                {
                    key: 'eadc78165ff1f8ea94ad7cfdc54990738a4c53f6e0507b42154201b8e5dff3b1',
                    isXOnly: false,
                },
            ];
            const result = calculateSumOfPrivateKeys(keys);
            expect(toHex(result)).toBe(keys[0].key);
        });

        it('should handle multiple keys with same value', () => {
            const sameKey =
                'eadc78165ff1f8ea94ad7cfdc54990738a4c53f6e0507b42154201b8e5dff3b1';
            const keys: PrivateKey[] = [
                { key: sameKey, isXOnly: false },
                { key: sameKey, isXOnly: false },
            ];
            const result = calculateSumOfPrivateKeys(keys);
            // Should produce valid result
            expect(result).toBeInstanceOf(Uint8Array);
            expect(result.length).toBe(32);
        });
    });
});
