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
};
