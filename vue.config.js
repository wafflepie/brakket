/* eslint-env node */
const path = require("path")
const OfflinePlugin = require("offline-plugin")

module.exports = {
  chainWebpack: config => {
    config.module
      .rule("vue")
      .use("vue-loader")
      .tap(options => {
        options.loaders.scss.push({
          loader: "sass-resources-loader",
          options: {
            resources: path.resolve(
              __dirname,
              "src/client/assets/scss/_variables.scss"
            ),
          },
        })

        return options
      })

    config.plugin("offline").use(OfflinePlugin)
    config
      .entry("app")
      .clear()
      .add("./src/client/index.js")
  },
  devServer: {
    proxy: "http://localhost:3001",
  },
}
