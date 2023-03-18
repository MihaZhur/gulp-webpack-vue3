const webpackConfig = {
    output: {
      filename: "bundle.js",
    },
    performance: {
      hints: false,
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: "vue-loader",
        },
        {
          test: /\.(js)$/,
          loader: `babel-loader`,
          exclude: /(node_modules)/,
        },
      ],
    },
    resolve: {
      extensions: [`.js`, `.vue`, `.json`],
      alias: {
        vue: "vue/dist/vue.esm-bundler.js",
      },
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: {
            filename: `vendors.js`,
            test: /node_modules/,
            chunks: `all`,
            enforce: true,
          },
        },
      },
    },
    plugins: [],
}

module.exports = webpackConfig