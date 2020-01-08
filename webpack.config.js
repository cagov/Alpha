const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const minificationOptions = {
  collapseWhitespace: true,
  removeComments: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  useShortDoctype: true
}

module.exports = {
  mode: 'development',
  entry: {
    javascript: [
      './src/js/index.js'
    ],
    style: [
      './src/css/_index.scss'
    ],
    minwage: [
      './src/js/minwage/index.js'
    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.scss$/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: 'css/[id].css',
    }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html',
      excludeChunks: ['minwage'],
      minify: minificationOptions
    }),
    new HtmlWebpackPlugin({
      filename: 'feedback/index.html',
      template: 'src/feedback/index.html',
      excludeChunks: ['minwage'],
      minify: minificationOptions
    }),
    new HtmlWebpackPlugin({
      filename: 'about/index.html',
      template: 'src/about/index.html',
      excludeChunks: ['minwage'],
      minify: minificationOptions
    }),
    new HtmlWebpackPlugin({
      filename: 'services/california-birth-certificate/index.html',
      template: 'src/services/california-birth-certificate/index.html',
      excludeChunks: ['minwage'],
      minify: minificationOptions
    }),
    new HtmlWebpackPlugin({
      filename: 'services/minimum-wage-in-california/index.html',
      template: 'src/services/minimum-wage-in-california/index.html',
      minify: minificationOptions
    }),
    new HtmlWebpackPlugin({
      filename: 'services/state-of-california-employee-holidays/index.html',
      template: 'src/services/state-of-california-employee-holidays/index.html',
      excludeChunks: ['minwage'],
      minify: minificationOptions
    })
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ],
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'css/fonts/',
              publicPath: 'fonts/',
            }
          }
        ]
      },
      {
        test: /\.png$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: '/img/',
              publicPath: '/img/',
            }
          }
        ]
      }
    ],
  },
  output: {
    filename: "js/[name].[chunkhash].js",
    path: path.resolve(__dirname, 'public/'),
  },
};