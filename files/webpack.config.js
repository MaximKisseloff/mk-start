const path = require('path');
// eslint-disable-next-line no-unused-vars
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const config = require('./config');

module.exports = {
  entry: {
    base: `./${config.jsModules}/base.js`,
    vendor: `./${config.jsModules}/vendor.js`,
  },
  output: {
    filename: '[name].js',
    publicPath: '/js/',
  },
  watch: config.env === 'development',
  devtool: config.env === 'development' ? 'source-map' : false,
  mode: config.env || 'production',
  resolve: {
    extensions: ['.js'],
    modules: [path.resolve(`./${config.jsModules}/scripts`), 'node_modules'],
    alias: {
      $Vendor: path.resolve(__dirname, `./${config.jsModules}/vendor/`),
      $Config: path.resolve(__dirname, `./${config.jsModules}/scripts/config.js`),
      $Functions: path.resolve(__dirname, `./${config.jsModules}/scripts/functions/`),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          presets: [
            ['@babel/preset-env', {
              targets: {
                ie: '11',
                edge: '17',
              },
            }],
          ],
        },
      },
    ],
  },
  externals: {
    jquery: 'jQuery',
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
          },
        },
      }),
    ],
  },
};
