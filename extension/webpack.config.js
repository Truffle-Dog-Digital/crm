const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: "source-map",
  entry: {
    background: "./src/background.js",
    "lusha-contacts": "./src/lusha-contacts.js",
    "linkedin-withdraw": "./src/linkedin-withdraw.js",
    "linkedin-update-connected": "./src/linkedin-update-connected.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js",
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        { from: "src/**/*.html", to: "[name][ext]" },
        { from: "src/**/*.css", to: "[name][ext]" },
        { from: "src/**/*.png", to: "[name][ext]" },
        { from: "src/**/*.json", to: "[name][ext]" },
      ],
    }),
  ],
};
