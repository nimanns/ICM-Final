const path = require("path");
const { ProvidePlugin } = require("webpack");

module.exports = {
  entry: ["./src/index.js"],
  mode: "development",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        include: [path.resolve(__dirname, "src")],
        exclude: "/node_modules/",
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    extensionAlias: {
      ".js": [".js", ".ts"],
      ".cjs": [".cjs", ".cts"],
      ".mjs": [".mjs", ".mts"],
    },
  },
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new ProvidePlugin({
      p5: "p5",
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, "static"),
    },
    compress: true,
    port: 8081,
  },
};
