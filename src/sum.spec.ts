import { sum } from './index';

describe('Sum', () => {
    it('should sum two numbers', () => {
        expect(sum(4, 7)).toBe(11);
    });
});
