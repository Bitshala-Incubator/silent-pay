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
        '@silent-pay/core': '@silent-pay/core/src',
        '@silent-pay/esplora': '@silent-pay/esplora/src',
        '@silent-pay/level': '@silent-pay/level/src',
        '@silent-pay/wallet': '@silent-pay/wallet/src',
    },
};
