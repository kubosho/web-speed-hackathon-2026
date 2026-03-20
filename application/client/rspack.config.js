const path = require("path");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const { rspack } = require("@rspack/core");

const ANALYZE = process.env.ANALYZE === "true";

const SRC_PATH = path.resolve(__dirname, "./src");
const PUBLIC_PATH = path.resolve(__dirname, "../public");
const UPLOAD_PATH = path.resolve(__dirname, "../upload");
const DIST_PATH = path.resolve(__dirname, "../dist");

/** @type {import('@rspack/core').Configuration} */
const config = {
  devServer: {
    historyApiFallback: true,
    host: "0.0.0.0",
    port: 8080,
    proxy: [
      {
        context: ["/api"],
        target: "http://localhost:3000",
      },
    ],
    static: [PUBLIC_PATH, UPLOAD_PATH],
  },
  devtool: false,
  entry: {
    main: [
      path.resolve(SRC_PATH, "./index.css"),
      path.resolve(SRC_PATH, "./buildinfo.ts"),
      path.resolve(SRC_PATH, "./index.tsx"),
    ],
  },
  mode: "production",
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.(jsx?|tsx?|mjs|cjs)$/,
        use: [
          {
            loader: "builtin:swc-loader",
            options: {
              jsc: {
                parser: {
                  syntax: "typescript",
                  tsx: true,
                },
                transform: {
                  react: {
                    runtime: "automatic",
                  },
                },
              },
              env: {
                targets: "last 1 chrome version",
              },
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        use: [
          rspack.CssExtractRspackPlugin.loader,
          { loader: "css-loader", options: { url: false } },
          { loader: "postcss-loader" },
        ],
        type: "javascript/auto",
      },
      {
        resourceQuery: /binary/,
        type: "asset/resource",
        generator: {
          filename: "assets/[name]-[contenthash][ext]",
        },
      },
    ],
  },
  output: {
    chunkFilename: "scripts/chunk-[contenthash].js",
    filename: "scripts/[name]-[contenthash].js",

    path: DIST_PATH,
    publicPath: "/",
    clean: true,
  },
  plugins: [
    new rspack.ProvidePlugin({
      AudioContext: ["standardized-audio-context", "AudioContext"],
      Buffer: ["buffer", "Buffer"],
    }),
    new rspack.DefinePlugin({
      "process.env.BUILD_DATE": JSON.stringify(new Date().toISOString()),
      "process.env.COMMIT_HASH": JSON.stringify(process.env.SOURCE_VERSION || ""),
      "process.env.NODE_ENV": JSON.stringify("production"),
    }),
    new rspack.CssExtractRspackPlugin({
      filename: "styles/[name]-[contenthash].css",
    }),
    new rspack.CopyRspackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "node_modules/katex/dist/fonts"),
          to: path.resolve(DIST_PATH, "styles/fonts"),
        },
      ],
    }),
    new rspack.HtmlRspackPlugin({
      inject: true,
      template: path.resolve(SRC_PATH, "./index.html"),
    }),
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".mjs", ".cjs", ".jsx", ".js"],
    alias: {
      "bayesian-bm25$": path.resolve(__dirname, "node_modules", "bayesian-bm25/dist/index.js"),
      ["kuromoji$"]: path.resolve(__dirname, "node_modules", "kuromoji/build/kuromoji.js"),
      "@ffmpeg/ffmpeg$": path.resolve(
        __dirname,
        "node_modules",
        "@ffmpeg/ffmpeg/dist/esm/index.js",
      ),
      "@ffmpeg/core$": path.resolve(
        __dirname,
        "node_modules",
        "@ffmpeg/core/dist/umd/ffmpeg-core.js",
      ),
      "@ffmpeg/core/wasm$": path.resolve(
        __dirname,
        "node_modules",
        "@ffmpeg/core/dist/umd/ffmpeg-core.wasm",
      ),
      "@imagemagick/magick-wasm/magick.wasm$": path.resolve(
        __dirname,
        "node_modules",
        "@imagemagick/magick-wasm/dist/magick.wasm",
      ),
    },
    fallback: {
      fs: false,
      path: false,
      url: false,
    },
  },
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
  ignoreWarnings: [
    {
      module: /@ffmpeg/,
      message: /Critical dependency/,
    },
  ],
};

if (ANALYZE) {
  config.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = config;
