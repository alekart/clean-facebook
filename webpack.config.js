const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: {
    popup: './src/scripts/popup.ts',
    content: './src/scripts/content.ts',
    'popup-style': './src/styles/popup.scss',
    'content-style': './src/styles/content.scss',
  },
  plugins: [
    new MiniCssExtractPlugin(),
    // Copy static assets from `public` folder to `build` folder
    new CopyWebpackPlugin({
      patterns: [
        {
          from: '*',
          context: 'src',
        },
        {
          from: 'icons/*',
          context: 'src',
        },
      ],
    }),
  ],
  target: ['web', 'es5'],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          'ts-loader',
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              // Prefer `dart-sass`
              implementation: require('sass'),
              sourceMap: true,
              webpackImporter: false,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    open: true,
    hot: false,
    static: [{
      directory: path.join(__dirname, 'dist'),
    }, {
      directory: path.join(__dirname, 'dist'),
    }],
    port: 9000,
  },
};
