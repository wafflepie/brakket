/* eslint-env node */
const path = require("path")

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
              "src/assets/scss/_variables.scss"
            ),
          },
        })

        return options
      })
  },
}
