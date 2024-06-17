/* eslint-disable @typescript-eslint/no-var-requires,@typescript-eslint/no-explicit-any */
// @ts-ignore
require("dotenv").config({
  path: process.env.webpackEnv ? `.env.${process.env.webpackEnv}` : `.env`,
});
const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const InterpolateHtmlPlugin = require("react-dev-utils/InterpolateHtmlPlugin");

let mode = "development";
let distFolder;
let optimization = {
  usedExports: true,
};

switch (process.env.webpackEnv) {
  case "sandbox":
    distFolder = path.resolve("./dist/dev");
    break;
  case "production":
    mode = "production";
    distFolder = path.resolve("./dist/production");
    optimization = {
      // @ts-ignore
      minimize: true,
      minimizer: [
        new TerserPlugin({
          parallel: true,
        }),
      ],
      usedExports: true,
    };
    break;
  default:
    distFolder = path.resolve("./dist/local");
}

// @ts-ignore
process.env.NODE_ENV = mode;

// @ts-ignore
module.exports = {
  mode,
  entry: {
    enterpriseweb: "./src/index",
  },
  devtool: "source-map",
  output: {
    filename: "[name].js",
    path: distFolder,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test: /\.(pdf|jpg|png|gif|ico|wav|mp3)$/,
        use: {
          loader: "url-loader",
        },
      },
      {
        test: /\.svg$/,
        use: ["@svgr/webpack", "file-loader"],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(css|scss)$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
  target: "web",
  plugins: [
    new HtmlWebPackPlugin({
      title: "emaileditor",
      template: "./public/index.html",
      templateParameters: {
        PUBLIC_URL: JSON.stringify(process.env.PUBLIC_URL),
      },
      filename: "./index.html",
      favicon: "./public/favicon.ico",
      chunks: ["emaileditor"],
      inject: true,
      publicPath: process.env.PUBLIC_URL,
    }),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(mode),
        REACT_APP_BACKEND_URL: JSON.stringify(process.env.REACT_APP_BACKEND_URL),
        PUBLIC_URL: JSON.stringify(process.env.PUBLIC_URL),
        REACT_APP_AUTH_URL: JSON.stringify(process.env.REACT_APP_AUTH_URL),
        REACT_APP_CP_TOKEN_COOKIE_NAME: JSON.stringify(process.env.REACT_APP_CP_TOKEN_COOKIE_NAME),
        REACT_APP_USE_SECURE_COOKIES: JSON.stringify(process.env.REACT_APP_USE_SECURE_COOKIES),
      },
    }),
    new CopyPlugin({
      patterns: ["./public/logo192.png", "./public/logo512.png", "./public/robots.txt"],
    }),
    new InterpolateHtmlPlugin(HtmlWebPackPlugin, {
      PUBLIC_URL: process.env.PUBLIC_URL,
    }),
  ],
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    alias: {
      "@material-ui/styles": path.resolve("node_modules", "@material-ui/styles"),
    },
    fallback: {
      fs: false,
    },
  },
  optimization,
};
