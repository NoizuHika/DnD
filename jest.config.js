module.exports = {
  preset: 'react-native',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|my-project|react-navigation)/)',
  ],
  moduleNameMapper: {
    '\\.webp$': '<rootDir>/__mocks__/fileMock.js',
  },
};