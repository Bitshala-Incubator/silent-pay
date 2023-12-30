import { Outpoint, PrivateKey } from '../src/core/interface';
import { calculateSumOfPrivateKeys, hashOutpoints } from '../src/core';
import { inputPrivateKeys, outpoints } from './fixtures/utility';

describe('Utility', () => {
    it.each(outpoints)(
        'should calculate hash of outpoints in tx',
        (data: { outpoints: Outpoint[]; expected: string }) => {
            const { outpoints, expected } = data;
            const hash = hashOutpoints(outpoints);
            expect(hash.toString('hex')).toBe(expected);
        },
    );

    it.each(inputPrivateKeys)(
        'should calculate sum of private keys',
        async (data: { keys: PrivateKey[]; expected: string }) => {
            const { keys, expected } = data;
            const sum = calculateSumOfPrivateKeys(keys);
            expect(sum.toString('hex')).toBe(expected);
        },
    );
});
