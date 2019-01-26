module.exports = {
  use: [
    ['@neutrinojs/airbnb', {
      eslint: {
        rules: {
          "no-plusplus": "off",
          "no-mixed-operators": "off",
          "object-curly-newline": "off"
        }
      }
    }],
    '@neutrinojs/react-components',
    '@neutrinojs/jest'
  ]
};
