module.exports = {
    moduleNameMapper: {
      '^src/(.*)$': '<rootDir>/src/$1',
    },
    rootDir: '.',
    testRegex: '.*\\.spec\\.ts$',
    transform: {
      '^.+\\.(t|j)s$': 'ts-jest',
    },
    collectCoverageFrom: ['**/*.(t|j)s'],
    coverageDirectory: './coverage',
    testEnvironment: 'node',
    // setupFilesAfterEnv: ['./jest.setup.ts'],
  };