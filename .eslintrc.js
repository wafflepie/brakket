const prettierConfig = require("./prettier.config")

module.exports = {
  root: true,
  extends: ["plugin:vue/recommended", "@vue/prettier"],
  parserOptions: {
    parser: "babel-eslint",
    sourceType: "module",
  },
  rules: {
    "prettier/prettier": ["warning", prettierConfig],
  },
}
