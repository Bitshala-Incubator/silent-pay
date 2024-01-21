module.exports = {
    preset: 'ts-jest',
    verbose: true,
    testEnvironment: 'node',
    rootDir: '.',
    roots: ['<rootDir>/test/'],
    testRegex: '.*\\.spec\\.ts$',
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    collectCoverageFrom: ['<rootDir>/src/**/*.(t|j)s'],
    coveragePathIgnorePatterns: ['.*.spec.ts'],
    coverageDirectory: './coverage',
    testTimeout: 30000,
};
