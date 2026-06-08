export default {
    preset: 'ts-jest',
    verbose: true,
    testEnvironment: 'node',
    testRegex: '.*\\.spec\\.ts$',
    transform: {
        '^.+\\.(t|j)s$': [
            'ts-jest',
            {
                isolatedModules: true,
                tsconfig: {
                    moduleResolution: 'node',
                    module: 'commonjs',
                },
            },
        ],
    },
    coveragePathIgnorePatterns: ['.*.spec.ts'],
    coverageDirectory: './coverage',
    moduleNameMapper: {
        '@silent-pay/core': '<rootDir>/packages/core/src',
        '@silent-pay/esplora': '<rootDir>/packages/esplora/src',
        '@silent-pay/level': '<rootDir>/packages/level/src',
        '@silent-pay/wallet': '<rootDir>/packages/wallet/src',
    },
};
