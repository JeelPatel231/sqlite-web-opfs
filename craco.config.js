const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  webpack: {
    plugins: {
      add: [
        new webpack.NormalModuleReplacementPlugin(/typeorm$/, function (result) {
          result.request = result.request.replace(/typeorm/, "typeorm/browser");
        }),
        new webpack.ProvidePlugin({
          "window.SQL": "sql.js/dist/sql-wasm.js",
        }),
        new CopyWebpackPlugin({
          patterns: [
            {
              from: "./node_modules/sql.js/dist/sql-wasm.wasm",
              to: "./",
            },
            // {
            //   from: "./node_modules/localforage/dist/localforage.min.js",
            //   to: "./",
            // },
          ],
        }),
      ],
    },
    configure: (webpackConfig) => {
      // Add the following lines to handle 'crypto' and 'fs' dependencies
      webpackConfig.resolve.fallback = {
        util: require.resolve("util/"),
        fs: require.resolve("browserify-fs"), // or 'empty' if you prefer an empty module
        crypto: require.resolve("crypto-browserify"),
        stream: require.resolve("stream-browserify"),
        path: require.resolve("path-browserify"),
        vm: require.resolve("vm-browserify"),
      };
      // Add the 'module' configuration for handling .wasm files
      webpackConfig.module.rules.push({
        test: /\.wasm$/,
        type: "javascript/auto",
      });

      return webpackConfig;
    },
  },
};
