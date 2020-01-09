const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    es5: [
      './src/js/es5.js',
    ],
  },
  module: {
    rules: [{
      test: /\.js$/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            ['@babel/preset-env', {
              modules: false,
              useBuiltIns: 'usage',
              targets: {
                browsers: [
                  '> 1%',
                  'last 2 versions'
                ],
              },
            }],
          ],
        },
      },
    }],
  },
  output: {
    filename: "js/[name].[chunkhash].js",
    path: path.resolve(__dirname, 'public/'),
  }
};