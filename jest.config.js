/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    collectCoverage: true,
    clearMocks: true,
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
};
