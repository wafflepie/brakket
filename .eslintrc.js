const prettierConfig = require("./prettier.config")

module.exports = {
  root: true,
  extends: ["plugin:vue/essential", "@vue/prettier"],
  rules: {
    "prettier/prettier": ["warning", prettierConfig],
  },
}
