const appEnv = process.env.NODE_ENV || 'development';
const webpack = require('webpack');
const path = require('path');
const appPath = path.join(__dirname);
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const exclude = [/node_modules/, /vendor/];

const config = {
  // The base directory for resolvinnpg `entry` (must be absolute path)
  context: appPath,

  entry: ['./playground/index.js'],

  plugins: [
    new HtmlWebpackPlugin({
      inject: 'body',
      template: 'playground/index.html'
    }),
    new webpack.DefinePlugin({
      // We must envify CommonJS builds:
      // https://github.com/reactjs/redux/issues/1029
      'process.env.NODE_ENV': JSON.stringify(appEnv),
      $_ENVIRONMENT: JSON.stringify(appEnv)
    })
  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true
            }
          }
        ],
        exclude
      },
      // Expose React as global object
      {
        test: require.resolve('react'),
        use: [
          {
            loader: 'expose-loader',
            options: 'React'
          }
        ]
      }
    ]
  },

  // Settings for webpack-dev-server
  // `--hot` and `--progress` must be set using CLI
  devServer: {
    contentBase: './playground',
    noInfo: true,
    inline: true,
    historyApiFallback: true
  },

  externals: {
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true,
    'react/addons': true,
    jsdom: 'window',
    'text-encoding': 'window'
  },
  devtool: 'eval'

  // eslint: {
  //   configFile: '.eslintrc',
  //   failOnError: false,
  //   fix: true
  // }
};

module.exports = config;
