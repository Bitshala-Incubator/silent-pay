/**
 * author: Sindre Sorhus
 * license: MIT
 * source: https://github.com/sindresorhus/uint8array-extras
 *
 * Ported to TypeScript
 */

const uint8ArrayStringified = '[object Uint8Array]';
const arrayBufferStringified = '[object ArrayBuffer]';

type Ctor<T> = new (...args: never[]) => T;

function isType<T>(
    value: unknown,
    typeConstructor: Ctor<T>,
    typeStringified: string,
): value is T {
    if (value == null) return false;
    if (value instanceof typeConstructor) return true;
    return Object.prototype.toString.call(value) === typeStringified;
}

export function isUint8Array(value: unknown): value is Uint8Array {
    return isType(value, Uint8Array, uint8ArrayStringified);
}

function isArrayBuffer(value: unknown): value is ArrayBuffer {
    return isType(value, ArrayBuffer, arrayBufferStringified);
}

function isUint8ArrayOrArrayBuffer(
    value: unknown,
): value is Uint8Array | ArrayBuffer {
    return isUint8Array(value) || isArrayBuffer(value);
}

export function assertUint8Array(value: unknown): asserts value is Uint8Array {
    if (!isUint8Array(value)) {
        throw new TypeError(`Expected \`Uint8Array\`, got \`${typeof value}\``);
    }
}

export function assertUint8ArrayOrArrayBuffer(
    value: unknown,
): asserts value is Uint8Array | ArrayBuffer {
    if (!isUint8ArrayOrArrayBuffer(value)) {
        throw new TypeError(
            `Expected \`Uint8Array\` or \`ArrayBuffer\`, got \`${typeof value}\``,
        );
    }
}

export type TypedArray =
    | Int8Array
    | Uint8Array
    | Uint8ClampedArray
    | Int16Array
    | Uint16Array
    | Int32Array
    | Uint32Array
    | Float32Array
    | Float64Array
    | BigInt64Array
    | BigUint64Array;

export function toUint8Array(
    value: TypedArray | ArrayBuffer | DataView,
): Uint8Array {
    if (value instanceof ArrayBuffer) {
        return new Uint8Array(value);
    }

    if (ArrayBuffer.isView(value)) {
        return new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
    }

    throw new TypeError(`Unsupported value, got \`${typeof value}\`.`);
}

export function concatUint8Arrays(
    arrays: Uint8Array[],
    totalLength?: number,
): Uint8Array {
    if (arrays.length === 0) {
        return new Uint8Array(0);
    }

    totalLength ??= arrays.reduce(
        (accumulator, currentValue) => accumulator + currentValue.length,
        0,
    );

    const returnValue = new Uint8Array(totalLength);

    let offset = 0;
    for (const array of arrays) {
        assertUint8Array(array);
        returnValue.set(array, offset);
        offset += array.length;
    }

    return returnValue;
}

export function areUint8ArraysEqual(a: Uint8Array, b: Uint8Array): boolean {
    assertUint8Array(a);
    assertUint8Array(b);

    if (a === b) {
        return true;
    }

    if (a.length !== b.length) {
        return false;
    }

    for (let index = 0; index < a.length; index++) {
        if (a[index] !== b[index]) {
            return false;
        }
    }

    return true;
}

/**
 * Compare two Uint8Arrays and return their relative order.
 * - -1 if a < b
 * -  0 if a === b
 * -  1 if a > b
 */
export function compareUint8Arrays(a: Uint8Array, b: Uint8Array): -1 | 0 | 1 {
    assertUint8Array(a);
    assertUint8Array(b);

    const length = Math.min(a.length, b.length);

    for (let index = 0; index < length; index++) {
        const diff = a[index] - b[index];
        if (diff !== 0) {
            return Math.sign(diff) as -1 | 0 | 1;
        }
    }

    return Math.sign(a.length - b.length) as -1 | 0 | 1;
}

function assertString(value: unknown): asserts value is string {
    if (typeof value !== 'string') {
        throw new TypeError(`Expected \`string\`, got \`${typeof value}\``);
    }
}

const cachedEncoder = new globalThis.TextEncoder();

export function stringToUint8Array(string: string): Uint8Array {
    assertString(string);
    return cachedEncoder.encode(string);
}

function base64ToBase64Url(base64: string): string {
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlToBase64(base64url: string): string {
    return base64url.replace(/-/g, '+').replace(/_/g, '/');
}

// Reference: https://phuoc.ng/collection/this-vs-that/concat-vs-push/
const MAX_BLOCK_SIZE = 65_535;

export function uint8ArrayToBase64(
    array: Uint8Array,
    options: { urlSafe?: boolean } = {},
): string {
    assertUint8Array(array);
    const { urlSafe = false } = options;

    let base64: string;

    if (array.length < MAX_BLOCK_SIZE) {
        // Required as `btoa` and `atob` don't properly support Unicode
        base64 = globalThis.btoa(
            String.fromCodePoint.apply(null, array as unknown as number[]),
        );
    } else {
        let s = '';
        for (const value of array) {
            s += String.fromCodePoint(value);
        }

        base64 = globalThis.btoa(s);
    }

    return urlSafe ? base64ToBase64Url(base64) : base64;
}

export function base64ToUint8Array(base64String: string): Uint8Array {
    assertString(base64String);
    return Uint8Array.from(
        globalThis.atob(base64UrlToBase64(base64String)),
        (x) => x.codePointAt(0)!,
    );
}

export function stringToBase64(
    string: string,
    options: { urlSafe?: boolean } = {},
): string {
    assertString(string);
    return uint8ArrayToBase64(stringToUint8Array(string), options);
}

const byteToHexLookupTable = Array.from({ length: 256 }, (_, index) =>
    index.toString(16).padStart(2, '0'),
);

export function uint8ArrayToHex(array: Uint8Array): string {
    assertUint8Array(array);

    // Concatenating a string is faster than using an array.
    let hexString = '';

    // Max performance is critical, using for loop instead of array methods
    for (let index = 0; index < array.length; index++) {
        hexString += byteToHexLookupTable[array[index]];
    }

    return hexString;
}

const hexToDecimalLookupTable: Record<string, number | undefined> = {
    0: 0,
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    a: 10,
    b: 11,
    c: 12,
    d: 13,
    e: 14,
    f: 15,
    A: 10,
    B: 11,
    C: 12,
    D: 13,
    E: 14,
    F: 15,
};

/**
 * Convert a hex string to a Uint8Array.
 * Throws for invalid hex strings.
 */
export function hexToUint8Array(hexString: string): Uint8Array {
    assertString(hexString);

    // throw error for empty string or invalid length
    if (hexString.length === 0 || hexString.length % 2 !== 0) {
        throw new Error('Invalid hex string');
    }

    const resultLength = hexString.length / 2;
    const bytes = new Uint8Array(resultLength);

    for (let index = 0; index < resultLength; index++) {
        const highNibble = hexToDecimalLookupTable[hexString[index * 2]];
        const lowNibble = hexToDecimalLookupTable[hexString[index * 2 + 1]];

        // throw error for invalid hex characters
        if (highNibble === undefined || lowNibble === undefined) {
            throw new Error('Invalid hex string');
        }

        bytes[index] = (highNibble << 4) | lowNibble; // eslint-disable-line no-bitwise
    }

    return bytes;
}

/**
 * Read DataView#byteLength number of bytes from the given view, up to 48-bit.
 */
export function getUintBE(view: DataView): number | undefined {
    const { byteLength } = view;

    if (byteLength === 6) {
        return view.getUint16(0) * 2 ** 32 + view.getUint32(2);
    }

    if (byteLength === 5) {
        return view.getUint8(0) * 2 ** 32 + view.getUint32(1);
    }

    if (byteLength === 4) {
        return view.getUint32(0);
    }

    if (byteLength === 3) {
        return view.getUint8(0) * 2 ** 16 + view.getUint16(1);
    }

    if (byteLength === 2) {
        return view.getUint16(0);
    }

    if (byteLength === 1) {
        return view.getUint8(0);
    }

    return undefined;
}

export function indexOf(array: Uint8Array, value: Uint8Array): number {
    const arrayLength = array.length;
    const valueLength = value.length;

    if (valueLength === 0) {
        return -1;
    }

    if (valueLength > arrayLength) {
        return -1;
    }

    const validOffsetLength = arrayLength - valueLength;

    for (let index = 0; index <= validOffsetLength; index++) {
        let isMatch = true;
        for (let index2 = 0; index2 < valueLength; index2++) {
            if (array[index + index2] !== value[index2]) {
                isMatch = false;
                break;
            }
        }

        if (isMatch) {
            return index;
        }
    }

    return -1;
}

export function includes(array: Uint8Array, value: Uint8Array): boolean {
    return indexOf(array, value) !== -1;
}

/**
 * Convert a Uint8Array (or ArrayBuffer) of UTF-8 bytes into a JS string.
 * Only "utf8" is supported. For any other encoding you'll need a polyfill.
 */
export function uint8ArrayToString(
    input: Uint8Array | ArrayBuffer,
    encoding: string = 'utf8',
): string {
    assertUint8ArrayOrArrayBuffer(input);

    // Reject anything other than UTF-8
    if (!/utf-?8/i.test(encoding)) {
        throw new Error(
            `Encoding "${encoding}" isn't supported without a TextDecoder polyfill`,
        );
    }

    // Normalise to Uint8Array
    const bytes = input instanceof Uint8Array ? input : new Uint8Array(input);
    return decodeUtf8(bytes);
}

/**
 * Minimal UTF-8 decoder
 */
function decodeUtf8(bytes: Uint8Array): string {
    let i = 0;
    const l = bytes.length;
    const codeUnits: number[] = [];
    let result = '';

    while (i < l) {
        const byte1 = bytes[i++];

        // 1-byte (ASCII)
        if (byte1 < 0x80) {
            codeUnits.push(byte1);
        }
        // 2-byte
        else if (byte1 < 0xe0) {
            const byte2 = bytes[i++] & 0x3f;
            codeUnits.push(((byte1 & 0x1f) << 6) | byte2);
        }
        // 3-byte
        else if (byte1 < 0xf0) {
            const byte2 = bytes[i++] & 0x3f;
            const byte3 = bytes[i++] & 0x3f;
            codeUnits.push(((byte1 & 0x0f) << 12) | (byte2 << 6) | byte3);
        }
        // 4-byte (→ surrogate pair)
        else {
            const byte2 = bytes[i++] & 0x3f;
            const byte3 = bytes[i++] & 0x3f;
            const byte4 = bytes[i++] & 0x3f;
            let cp =
                ((byte1 & 0x07) << 18) | (byte2 << 12) | (byte3 << 6) | byte4;
            cp -= 0x10000;
            codeUnits.push(0xd800 + (cp >> 10), 0xdc00 + (cp & 0x3ff));
        }

        // Flush periodically to avoid huge apply() calls
        if (codeUnits.length > 0x8000) {
            result += String.fromCharCode.apply(
                null,
                codeUnits as unknown as number[],
            );
            codeUnits.length = 0;
        }
    }

    return (
        result +
        String.fromCharCode.apply(null, codeUnits as unknown as number[])
    );
}

// ============================================================================
// Additional utilities for Bitcoin/Silent Payment specific operations
// ============================================================================

/**
 * Create DataView for efficient integer operations
 */
export function createView(arr: Uint8Array, offset: number = 0): DataView {
    return new DataView(arr.buffer, arr.byteOffset + offset);
}

/**
 * Reverse a Uint8Array (creates a copy, doesn't mutate)
 * Replaces Buffer.reverse()
 */
export function reverseUint8Array(arr: Uint8Array): Uint8Array {
    const result = new Uint8Array(arr);
    result.reverse();
    return result;
}

// ============================================================================
// Convenient aliases matching the old Buffer API naming
// ============================================================================

/** Alias for hexToUint8Array */
export const fromHex = hexToUint8Array;
/** Alias for uint8ArrayToHex */
export const toHex = uint8ArrayToHex;
/** Alias for concatUint8Arrays */
export const concat = concatUint8Arrays;
/** Alias for reverseUint8Array */
export const reverse = reverseUint8Array;
