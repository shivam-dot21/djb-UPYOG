const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: "./src/index.js",
  devtool: "source-map",
  resolve: {
    fallback: {
      "process": require.resolve("process/browser"),
      "buffer": require.resolve("buffer"),
      "util": require.resolve("util/"),
      "stream": require.resolve("stream-browserify"),
      "assert": require.resolve("assert"),
      "crypto": require.resolve("crypto-browserify"),
      "string_decoder": require.resolve("string_decoder"),
      "url": require.resolve("url")
    }
  },
  module: {
    rules: [
      {
        test: /\.(js)$/m,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
    ],
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "build"),
    publicPath: "/digit-ui/",
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
    minimizer: [new TerserPlugin()],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({ 
      inject: true, 
      template: "public/index.html",
      scriptLoading: "defer"
    }),
    // Fix process/BUFFER for Digit-UI
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    })
  ],
  // Browser environment
  node: {
    global: false,
    __filename: false,
    __dirname: false,
  }
};
