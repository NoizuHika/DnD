module.exports = {
  preset: 'react-native',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  testPathIgnorePatterns: ['/node_modules/', '/build/'],
};