module.exports = {
    preset: '../../jest.config.ts',
    rootDir: '.',
    roots: ['<rootDir>/test/'],
    collectCoverageFrom: ['<rootDir>/src/**/*.(t|j)s'],
    testTimeout: 30000,
};
