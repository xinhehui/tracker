const path = require('path')

module.exports = {
  rootDir: path.resolve(__dirname, '../../'),
  roots: ['<rootDir>/test/unit/'],
  moduleFileExtensions: [
    'js',
    'json'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^root/(.*)$': '<rootDir>/$1'
  },
  transform: {
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest'
  },
  testRegex: 'error.spec',
  collectCoverageFrom: [
    '!src/**/*.{js}',
    '!**/node_modules/**',
    '!dist'
  ]
}
