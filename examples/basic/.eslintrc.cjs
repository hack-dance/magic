const { resolve } = require("node:path")

const project = resolve(__dirname, "tsconfig.lint.json")

/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@repo/eslint-config/library.js"],
  parser: "@typescript-eslint/parser",
  ignorePatterns: [".eslintrc.cjs"],
  parserOptions: {
    project
  },
  overrides: [
    {
      extends: ["plugin:@typescript-eslint/disable-type-checked"],
      files: ["./**/*.js", "*.js"]
    }
  ]
}
