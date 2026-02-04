import {
    isUint8Array,
    assertUint8Array,
    assertUint8ArrayOrArrayBuffer,
    toUint8Array,
    concatUint8Arrays,
    areUint8ArraysEqual,
    compareUint8Arrays,
    stringToUint8Array,
    uint8ArrayToBase64,
    base64ToUint8Array,
    stringToBase64,
    uint8ArrayToHex,
    hexToUint8Array,
    getUintBE,
    indexOf,
    includes,
    uint8ArrayToString,
    createView,
    reverseUint8Array,
    fromHex,
    toHex,
    concat,
    reverse,
} from '../src';

describe('Uint8Array Utilities', () => {
    describe('isUint8Array', () => {
        it('should return true for Uint8Array', () => {
            expect(isUint8Array(new Uint8Array([1, 2, 3]))).toBe(true);
        });

        it('should return false for null', () => {
            expect(isUint8Array(null)).toBe(false);
        });

        it('should return false for undefined', () => {
            expect(isUint8Array(undefined)).toBe(false);
        });

        it('should return false for regular array', () => {
            expect(isUint8Array([1, 2, 3])).toBe(false);
        });

        it('should return false for string', () => {
            expect(isUint8Array('test')).toBe(false);
        });

        it('should return false for number', () => {
            expect(isUint8Array(123)).toBe(false);
        });

        it('should return false for ArrayBuffer', () => {
            expect(isUint8Array(new ArrayBuffer(10))).toBe(false);
        });
    });

    describe('assertUint8Array', () => {
        it('should not throw for valid Uint8Array', () => {
            expect(() =>
                assertUint8Array(new Uint8Array([1, 2, 3])),
            ).not.toThrow();
        });

        it('should throw for null', () => {
            expect(() => assertUint8Array(null)).toThrow(TypeError);
            expect(() => assertUint8Array(null)).toThrow(
                'Expected `Uint8Array`',
            );
        });

        it('should throw for string', () => {
            expect(() => assertUint8Array('test')).toThrow(TypeError);
        });

        it('should throw for number', () => {
            expect(() => assertUint8Array(123)).toThrow(TypeError);
        });

        it('should throw for regular array', () => {
            expect(() => assertUint8Array([1, 2, 3])).toThrow(TypeError);
        });
    });

    describe('assertUint8ArrayOrArrayBuffer', () => {
        it('should not throw for Uint8Array', () => {
            expect(() =>
                assertUint8ArrayOrArrayBuffer(new Uint8Array([1, 2, 3])),
            ).not.toThrow();
        });

        it('should not throw for ArrayBuffer', () => {
            expect(() =>
                assertUint8ArrayOrArrayBuffer(new ArrayBuffer(10)),
            ).not.toThrow();
        });

        it('should throw for null', () => {
            expect(() => assertUint8ArrayOrArrayBuffer(null)).toThrow(
                TypeError,
            );
            expect(() => assertUint8ArrayOrArrayBuffer(null)).toThrow(
                'Expected `Uint8Array` or `ArrayBuffer`',
            );
        });

        it('should throw for string', () => {
            expect(() => assertUint8ArrayOrArrayBuffer('test')).toThrow(
                TypeError,
            );
        });
    });

    describe('toUint8Array', () => {
        it('should convert ArrayBuffer to Uint8Array', () => {
            const buffer = new ArrayBuffer(4);
            const result = toUint8Array(buffer);
            expect(result).toBeInstanceOf(Uint8Array);
            expect(result.length).toBe(4);
        });

        it('should convert Int8Array to Uint8Array', () => {
            const int8 = new Int8Array([1, 2, 3]);
            const result = toUint8Array(int8);
            expect(result).toBeInstanceOf(Uint8Array);
            expect(result.length).toBe(3);
        });

        it('should convert DataView to Uint8Array', () => {
            const buffer = new ArrayBuffer(4);
            const view = new DataView(buffer);
            const result = toUint8Array(view);
            expect(result).toBeInstanceOf(Uint8Array);
            expect(result.length).toBe(4);
        });

        it('should preserve data from Int32Array', () => {
            const int32 = new Int32Array([0x01020304]);
            const result = toUint8Array(int32);
            expect(result).toBeInstanceOf(Uint8Array);
        });

        it('should throw for invalid input', () => {
            expect(() => toUint8Array('invalid' as any)).toThrow(TypeError);
        });
    });

    describe('concatUint8Arrays', () => {
        it('should concatenate two arrays', () => {
            const a = new Uint8Array([1, 2]);
            const b = new Uint8Array([3, 4]);
            const result = concatUint8Arrays([a, b]);
            expect(result).toEqual(new Uint8Array([1, 2, 3, 4]));
        });

        it('should concatenate multiple arrays', () => {
            const a = new Uint8Array([1]);
            const b = new Uint8Array([2]);
            const c = new Uint8Array([3]);
            const result = concatUint8Arrays([a, b, c]);
            expect(result).toEqual(new Uint8Array([1, 2, 3]));
        });

        it('should handle empty array input', () => {
            const result = concatUint8Arrays([]);
            expect(result).toEqual(new Uint8Array(0));
        });

        it('should handle single array', () => {
            const a = new Uint8Array([1, 2, 3]);
            const result = concatUint8Arrays([a]);
            expect(result).toEqual(new Uint8Array([1, 2, 3]));
        });

        it('should handle arrays with empty arrays', () => {
            const a = new Uint8Array([1, 2]);
            const b = new Uint8Array([]);
            const c = new Uint8Array([3, 4]);
            const result = concatUint8Arrays([a, b, c]);
            expect(result).toEqual(new Uint8Array([1, 2, 3, 4]));
        });

        it('should use provided totalLength', () => {
            const a = new Uint8Array([1, 2]);
            const b = new Uint8Array([3, 4]);
            const result = concatUint8Arrays([a, b], 4);
            expect(result).toEqual(new Uint8Array([1, 2, 3, 4]));
            expect(result.length).toBe(4);
        });

        it('should throw for non-Uint8Array elements', () => {
            const a = new Uint8Array([1, 2]);
            expect(() => concatUint8Arrays([a, 'invalid' as any])).toThrow(
                TypeError,
            );
        });
    });

    describe('areUint8ArraysEqual', () => {
        it('should return true for identical arrays', () => {
            const a = new Uint8Array([1, 2, 3]);
            const b = new Uint8Array([1, 2, 3]);
            expect(areUint8ArraysEqual(a, b)).toBe(true);
        });

        it('should return true for same reference', () => {
            const a = new Uint8Array([1, 2, 3]);
            expect(areUint8ArraysEqual(a, a)).toBe(true);
        });

        it('should return false for different values', () => {
            const a = new Uint8Array([1, 2, 3]);
            const b = new Uint8Array([1, 2, 4]);
            expect(areUint8ArraysEqual(a, b)).toBe(false);
        });

        it('should return false for different lengths', () => {
            const a = new Uint8Array([1, 2, 3]);
            const b = new Uint8Array([1, 2]);
            expect(areUint8ArraysEqual(a, b)).toBe(false);
        });

        it('should return true for empty arrays', () => {
            const a = new Uint8Array([]);
            const b = new Uint8Array([]);
            expect(areUint8ArraysEqual(a, b)).toBe(true);
        });

        it('should throw for non-Uint8Array first parameter', () => {
            const b = new Uint8Array([1, 2, 3]);
            expect(() => areUint8ArraysEqual('invalid' as any, b)).toThrow(
                TypeError,
            );
        });
    });

    describe('compareUint8Arrays', () => {
        it('should return 0 for equal arrays', () => {
            const a = new Uint8Array([1, 2, 3]);
            const b = new Uint8Array([1, 2, 3]);
            expect(compareUint8Arrays(a, b)).toBe(0);
        });

        it('should return -1 when first array is smaller', () => {
            const a = new Uint8Array([1, 2, 3]);
            const b = new Uint8Array([1, 2, 4]);
            expect(compareUint8Arrays(a, b)).toBe(-1);
        });

        it('should return 1 when first array is larger', () => {
            const a = new Uint8Array([1, 2, 4]);
            const b = new Uint8Array([1, 2, 3]);
            expect(compareUint8Arrays(a, b)).toBe(1);
        });

        it('should return -1 when first array is shorter', () => {
            const a = new Uint8Array([1, 2]);
            const b = new Uint8Array([1, 2, 3]);
            expect(compareUint8Arrays(a, b)).toBe(-1);
        });

        it('should return 1 when first array is longer', () => {
            const a = new Uint8Array([1, 2, 3]);
            const b = new Uint8Array([1, 2]);
            expect(compareUint8Arrays(a, b)).toBe(1);
        });

        it('should return 0 for empty arrays', () => {
            const a = new Uint8Array([]);
            const b = new Uint8Array([]);
            expect(compareUint8Arrays(a, b)).toBe(0);
        });
    });

    describe('stringToUint8Array', () => {
        it('should convert ASCII string', () => {
            const result = stringToUint8Array('hello');
            expect(result).toBeInstanceOf(Uint8Array);
            expect(result.length).toBe(5);
        });

        it('should convert empty string', () => {
            const result = stringToUint8Array('');
            expect(result).toEqual(new Uint8Array([]));
        });

        it('should convert UTF-8 string', () => {
            const result = stringToUint8Array('Hello 👋');
            expect(result).toBeInstanceOf(Uint8Array);
            expect(result.length).toBeGreaterThan(7); // emoji takes multiple bytes
        });

        it('should throw for non-string input', () => {
            expect(() => stringToUint8Array(123 as any)).toThrow(TypeError);
        });
    });

    describe('uint8ArrayToBase64', () => {
        it('should encode to base64', () => {
            const input = new Uint8Array([72, 101, 108, 108, 111]); // "Hello"
            const result = uint8ArrayToBase64(input);
            expect(result).toBe('SGVsbG8=');
        });

        it('should encode empty array', () => {
            const input = new Uint8Array([]);
            const result = uint8ArrayToBase64(input);
            expect(result).toBe('');
        });

        it('should encode to URL-safe base64', () => {
            const input = new Uint8Array([255, 255, 255]);
            const result = uint8ArrayToBase64(input, { urlSafe: true });
            expect(result).not.toContain('+');
            expect(result).not.toContain('/');
            expect(result).not.toContain('=');
        });

        it('should handle large arrays', () => {
            const input = new Uint8Array(100000).fill(65); // 100k bytes
            const result = uint8ArrayToBase64(input);
            expect(result.length).toBeGreaterThan(0);
        });

        it('should throw for non-Uint8Array input', () => {
            expect(() => uint8ArrayToBase64('invalid' as any)).toThrow(
                TypeError,
            );
        });
    });

    describe('base64ToUint8Array', () => {
        it('should decode base64', () => {
            const result = base64ToUint8Array('SGVsbG8=');
            expect(result).toEqual(new Uint8Array([72, 101, 108, 108, 111]));
        });

        it('should decode URL-safe base64', () => {
            const result = base64ToUint8Array('_-_-');
            expect(result).toBeInstanceOf(Uint8Array);
        });

        it('should decode empty string', () => {
            const result = base64ToUint8Array('');
            expect(result).toEqual(new Uint8Array([]));
        });

        it('should throw for non-string input', () => {
            expect(() => base64ToUint8Array(123 as any)).toThrow(TypeError);
        });
    });

    describe('stringToBase64', () => {
        it('should encode string to base64', () => {
            const result = stringToBase64('Hello');
            expect(result).toBe('SGVsbG8=');
        });

        it('should encode empty string', () => {
            const result = stringToBase64('');
            expect(result).toBe('');
        });

        it('should encode to URL-safe base64', () => {
            const result = stringToBase64('Hello', { urlSafe: true });
            expect(typeof result).toBe('string');
        });

        it('should throw for non-string input', () => {
            expect(() => stringToBase64(123 as any)).toThrow(TypeError);
        });
    });

    describe('uint8ArrayToHex', () => {
        it('should convert to hex string', () => {
            const input = new Uint8Array([255, 0, 128]);
            const result = uint8ArrayToHex(input);
            expect(result).toBe('ff0080');
        });

        it('should convert empty array', () => {
            const input = new Uint8Array([]);
            const result = uint8ArrayToHex(input);
            expect(result).toBe('');
        });

        it('should pad single digit hex values', () => {
            const input = new Uint8Array([0, 1, 15, 16]);
            const result = uint8ArrayToHex(input);
            expect(result).toBe('00010f10');
        });

        it('should throw for non-Uint8Array input', () => {
            expect(() => uint8ArrayToHex('invalid' as any)).toThrow(TypeError);
        });
    });

    describe('hexToUint8Array', () => {
        it('should convert hex string to array', () => {
            const result = hexToUint8Array('ff0080');
            expect(result).toEqual(new Uint8Array([255, 0, 128]));
        });

        it('should handle uppercase hex', () => {
            const result = hexToUint8Array('FF0080');
            expect(result).toEqual(new Uint8Array([255, 0, 128]));
        });

        it('should handle mixed case hex', () => {
            const result = hexToUint8Array('FfAaBb');
            expect(result).toEqual(new Uint8Array([255, 170, 187]));
        });

        it('should throw for empty string', () => {
            expect(() => hexToUint8Array('')).toThrow('Invalid hex string');
        });

        it('should throw for odd length', () => {
            expect(() => hexToUint8Array('fff')).toThrow('Invalid hex string');
        });

        it('should throw for invalid characters', () => {
            expect(() => hexToUint8Array('gg')).toThrow('Invalid hex string');
        });

        it('should throw for non-string input', () => {
            expect(() => hexToUint8Array(123 as any)).toThrow(TypeError);
        });
    });

    describe('getUintBE', () => {
        it('should read 1-byte unsigned int', () => {
            const view = new DataView(new Uint8Array([255]).buffer);
            expect(getUintBE(view)).toBe(255);
        });

        it('should read 2-byte unsigned int', () => {
            const view = new DataView(new Uint8Array([0x01, 0x02]).buffer);
            expect(getUintBE(view)).toBe(0x0102);
        });

        it('should read 3-byte unsigned int', () => {
            const view = new DataView(
                new Uint8Array([0x01, 0x02, 0x03]).buffer,
            );
            expect(getUintBE(view)).toBe(0x010203);
        });

        it('should read 4-byte unsigned int', () => {
            const view = new DataView(
                new Uint8Array([0x01, 0x02, 0x03, 0x04]).buffer,
            );
            expect(getUintBE(view)).toBe(0x01020304);
        });

        it('should read 5-byte unsigned int', () => {
            const view = new DataView(
                new Uint8Array([0x01, 0x02, 0x03, 0x04, 0x05]).buffer,
            );
            expect(getUintBE(view)).toBeGreaterThan(0);
        });

        it('should read 6-byte unsigned int', () => {
            const view = new DataView(
                new Uint8Array([0x01, 0x02, 0x03, 0x04, 0x05, 0x06]).buffer,
            );
            expect(getUintBE(view)).toBeGreaterThan(0);
        });

        it('should return undefined for unsupported lengths', () => {
            const view = new DataView(
                new Uint8Array([1, 2, 3, 4, 5, 6, 7]).buffer,
            );
            expect(getUintBE(view)).toBeUndefined();
        });

        it('should return undefined for zero-length', () => {
            const view = new DataView(new Uint8Array([]).buffer);
            expect(getUintBE(view)).toBeUndefined();
        });
    });

    describe('indexOf', () => {
        it('should find value at start', () => {
            const array = new Uint8Array([1, 2, 3, 4, 5]);
            const value = new Uint8Array([1, 2]);
            expect(indexOf(array, value)).toBe(0);
        });

        it('should find value in middle', () => {
            const array = new Uint8Array([1, 2, 3, 4, 5]);
            const value = new Uint8Array([3, 4]);
            expect(indexOf(array, value)).toBe(2);
        });

        it('should find value at end', () => {
            const array = new Uint8Array([1, 2, 3, 4, 5]);
            const value = new Uint8Array([4, 5]);
            expect(indexOf(array, value)).toBe(3);
        });

        it('should return -1 when not found', () => {
            const array = new Uint8Array([1, 2, 3, 4, 5]);
            const value = new Uint8Array([6, 7]);
            expect(indexOf(array, value)).toBe(-1);
        });

        it('should return -1 for empty search value', () => {
            const array = new Uint8Array([1, 2, 3]);
            const value = new Uint8Array([]);
            expect(indexOf(array, value)).toBe(-1);
        });

        it('should return -1 when value is longer than array', () => {
            const array = new Uint8Array([1, 2]);
            const value = new Uint8Array([1, 2, 3]);
            expect(indexOf(array, value)).toBe(-1);
        });

        it('should find single byte', () => {
            const array = new Uint8Array([1, 2, 3, 4, 5]);
            const value = new Uint8Array([3]);
            expect(indexOf(array, value)).toBe(2);
        });
    });

    describe('includes', () => {
        it('should return true when value is found', () => {
            const array = new Uint8Array([1, 2, 3, 4, 5]);
            const value = new Uint8Array([2, 3]);
            expect(includes(array, value)).toBe(true);
        });

        it('should return false when value is not found', () => {
            const array = new Uint8Array([1, 2, 3, 4, 5]);
            const value = new Uint8Array([6, 7]);
            expect(includes(array, value)).toBe(false);
        });

        it('should return false for empty value', () => {
            const array = new Uint8Array([1, 2, 3]);
            const value = new Uint8Array([]);
            expect(includes(array, value)).toBe(false);
        });
    });

    describe('uint8ArrayToString', () => {
        it('should convert to UTF-8 string', () => {
            const input = new Uint8Array([72, 101, 108, 108, 111]);
            const result = uint8ArrayToString(input);
            expect(result).toBe('Hello');
        });

        it('should handle ArrayBuffer input', () => {
            const buffer = new Uint8Array([72, 101, 108, 108, 111]).buffer;
            const result = uint8ArrayToString(buffer);
            expect(result).toBe('Hello');
        });

        it('should handle empty array', () => {
            const input = new Uint8Array([]);
            const result = uint8ArrayToString(input);
            expect(result).toBe('');
        });

        it('should handle multi-byte UTF-8 characters', () => {
            const input = stringToUint8Array('Hello 👋');
            const result = uint8ArrayToString(input);
            expect(result).toBe('Hello 👋');
        });

        it('should throw for unsupported encoding', () => {
            const input = new Uint8Array([72, 101, 108, 108, 111]);
            expect(() => uint8ArrayToString(input, 'latin1')).toThrow(
                'Encoding "latin1" isn\'t supported',
            );
        });

        it('should accept utf-8 encoding', () => {
            const input = new Uint8Array([72, 101, 108, 108, 111]);
            expect(() => uint8ArrayToString(input, 'utf-8')).not.toThrow();
        });

        it('should accept utf8 encoding (no dash)', () => {
            const input = new Uint8Array([72, 101, 108, 108, 111]);
            expect(() => uint8ArrayToString(input, 'utf8')).not.toThrow();
        });

        it('should throw for non-Uint8Array or ArrayBuffer', () => {
            expect(() => uint8ArrayToString('invalid' as any)).toThrow(
                TypeError,
            );
        });
    });

    describe('createView', () => {
        it('should create DataView from Uint8Array', () => {
            const arr = new Uint8Array([1, 2, 3, 4]);
            const view = createView(arr);
            expect(view).toBeInstanceOf(DataView);
            expect(view.byteLength).toBe(4);
        });

        it('should create DataView with offset', () => {
            const arr = new Uint8Array([1, 2, 3, 4]);
            const view = createView(arr, 2);
            expect(view).toBeInstanceOf(DataView);
            expect(view.byteLength).toBe(2);
        });

        it('should handle zero offset', () => {
            const arr = new Uint8Array([1, 2, 3, 4]);
            const view = createView(arr, 0);
            expect(view.byteLength).toBe(4);
        });
    });

    describe('reverseUint8Array', () => {
        it('should reverse array', () => {
            const input = new Uint8Array([1, 2, 3, 4, 5]);
            const result = reverseUint8Array(input);
            expect(result).toEqual(new Uint8Array([5, 4, 3, 2, 1]));
        });

        it('should not mutate original array', () => {
            const input = new Uint8Array([1, 2, 3]);
            const original = new Uint8Array([1, 2, 3]);
            reverseUint8Array(input);
            expect(input).toEqual(original);
        });

        it('should handle single element', () => {
            const input = new Uint8Array([1]);
            const result = reverseUint8Array(input);
            expect(result).toEqual(new Uint8Array([1]));
        });

        it('should handle empty array', () => {
            const input = new Uint8Array([]);
            const result = reverseUint8Array(input);
            expect(result).toEqual(new Uint8Array([]));
        });

        it('should handle even length', () => {
            const input = new Uint8Array([1, 2, 3, 4]);
            const result = reverseUint8Array(input);
            expect(result).toEqual(new Uint8Array([4, 3, 2, 1]));
        });
    });

    describe('Aliases', () => {
        describe('fromHex', () => {
            it('should be an alias for hexToUint8Array', () => {
                expect(fromHex).toBe(hexToUint8Array);
            });

            it('should convert hex to Uint8Array', () => {
                const result = fromHex('deadbeef');
                expect(result).toEqual(new Uint8Array([222, 173, 190, 239]));
            });
        });

        describe('toHex', () => {
            it('should be an alias for uint8ArrayToHex', () => {
                expect(toHex).toBe(uint8ArrayToHex);
            });

            it('should convert Uint8Array to hex', () => {
                const result = toHex(new Uint8Array([222, 173, 190, 239]));
                expect(result).toBe('deadbeef');
            });
        });

        describe('concat', () => {
            it('should be an alias for concatUint8Arrays', () => {
                expect(concat).toBe(concatUint8Arrays);
            });

            it('should concatenate arrays', () => {
                const a = new Uint8Array([1, 2]);
                const b = new Uint8Array([3, 4]);
                const result = concat([a, b]);
                expect(result).toEqual(new Uint8Array([1, 2, 3, 4]));
            });
        });

        describe('reverse', () => {
            it('should be an alias for reverseUint8Array', () => {
                expect(reverse).toBe(reverseUint8Array);
            });

            it('should reverse array', () => {
                const result = reverse(new Uint8Array([1, 2, 3]));
                expect(result).toEqual(new Uint8Array([3, 2, 1]));
            });
        });
    });

    describe('Round-trip conversions', () => {
        it('should round-trip hex conversion', () => {
            const original = new Uint8Array([1, 2, 3, 255, 0, 128]);
            const hex = toHex(original);
            const result = fromHex(hex);
            expect(result).toEqual(original);
        });

        it('should round-trip base64 conversion', () => {
            const original = new Uint8Array([1, 2, 3, 255, 0, 128]);
            const base64 = uint8ArrayToBase64(original);
            const result = base64ToUint8Array(base64);
            expect(result).toEqual(original);
        });

        it('should round-trip string conversion', () => {
            const original = 'Hello World! 👋🌍';
            const bytes = stringToUint8Array(original);
            const result = uint8ArrayToString(bytes);
            expect(result).toBe(original);
        });
    });
});
