module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  collectCoverageFrom: [
    'src/food/**/*.{js,jsx}',
    '!src/food/**/__tests__/**',
    '!src/food/FoodOrderingDemoPage.jsx',
  ],
};
