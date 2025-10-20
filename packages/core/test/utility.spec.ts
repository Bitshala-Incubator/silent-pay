import {
    calculateSumOfPrivateKeys,
    createTaggedHash,
    createInputHash,
    PrivateKey,
    isPubKey,
    fromHex,
    toHex,
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
});
