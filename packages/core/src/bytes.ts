/**
 * Convert hex string to Uint8Array
 */
export function fromHex(hex: string): Uint8Array {
    const result = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
        result[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    return result;
}

/**
 * Convert Uint8Array to hex string
 */
export function toHex(arr: Uint8Array): string {
    return Array.from(arr, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Concatenate Uint8Arrays
 */
export function concat(arrays: Uint8Array[]): Uint8Array {
    const result = new Uint8Array(arrays.reduce((sum, arr) => sum + arr.length, 0));
    let offset = 0;
    for (const array of arrays) {
        result.set(array, offset);
        offset += array.length;
    }
    return result;
}

/**
 * Create DataView for efficient integer operations
 */
export function createView(arr: Uint8Array, offset = 0): DataView {
    return new DataView(arr.buffer, arr.byteOffset + offset);
}

/**
 * Reverse array in place (like Buffer.reverse())
 */
export function reverse(arr: Uint8Array): Uint8Array {
    const result = new Uint8Array(arr);
    result.reverse();
    return result;
}