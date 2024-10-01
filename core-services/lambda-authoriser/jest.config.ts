module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src', '<rootDir>/tests'],
    setupFiles: ['jest-plugin-context/setup'],
    moduleFileExtensions: ['js', 'ts', 'json'],
    testMatch: ["**/*.unitTest.ts"],
    coverageDirectory: './coverage'
  };