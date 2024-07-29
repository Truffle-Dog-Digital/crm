const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const Reloader = require("advanced-extension-reloader-watch-2/umd/reloader");

const reloader = new Reloader({
  port: 6220,
  all_tabs: true,
  hard: true,
});

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
    {
      apply: (compiler) => {
        compiler.hooks.done.tap("done", (stats) => {
          const an_error_occurred = stats.compilation.errors.length !== 0;

          if (an_error_occurred) {
            reloader.play_error_notification();
          } else {
            reloader.reload({
              ext_id: "mbkcooagmjgniifieejemjofhjddnkgi",
              play_sound: true,
            });
          }

          process.nextTick(() => process.exit(0));
        });
      },
    },
  ],
};
