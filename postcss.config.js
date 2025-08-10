const tailwindConfig = require('./tailwind.config.js');

module.exports = {
  plugins: {
    '@tailwindcss/postcss': { config: tailwindConfig },
    autoprefixer: {},
  },
};