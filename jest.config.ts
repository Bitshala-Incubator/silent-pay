module.exports = {
    preset: 'ts-jest',
    verbose: true,
    testEnvironment: 'node',
    testRegex: '.*\\.spec\\.ts$',
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    coveragePathIgnorePatterns: ['.*.spec.ts'],
    coverageDirectory: './coverage',
    moduleNameMapper: {
        '^@silent-pay/core(.*)$': '<rootDir>/packages/core/src$1',
        '^@silent-pay/esplora(.*)$': '<rootDir>/packages/esplora/src$1',
        '^@silent-pay/level(.*)$': '<rootDir>/packages/level/src$1',
        '^@silent-pay/wallet(.*)$': '<rootDir>/packages/wallet/src$1',
    },
};
