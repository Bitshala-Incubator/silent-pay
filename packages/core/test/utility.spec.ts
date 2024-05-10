import {
    calculateSumOfPrivateKeys,
    createTaggedHash,
    createInputHash,
    PrivateKey,
    isPubKey,
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
            expect(sum.toString('hex')).toBe(expected);
        },
    );

    it.each(createTaggedHashData)(
        'should calculate tagged hash',
        ({ tag, hex, expected }) => {
            const taggedHash = createTaggedHash(tag, Buffer.from(hex, 'hex'));
            expect(taggedHash.toString('hex')).toBe(expected);
        },
    );

    it.each(createInputHashData)(
        'should calculate input hash',
        ({ sumOfInputPublicKeys, outpoint, expected }) => {
            const inputHash = createInputHash(
                Buffer.from(sumOfInputPublicKeys, 'hex'),
                outpoint,
            );
            expect(inputHash.toString('hex')).toBe(expected);
        },
    );

    it.each(publicKeysTestData)(
        'should test for public key validity',
        ({ publickKey, valid }) => {
            expect(isPubKey(Buffer.from(publickKey, 'hex'))).toStrictEqual(
                valid,
            );
        },
    );
});
