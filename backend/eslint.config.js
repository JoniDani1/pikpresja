const globals = require("globals");
const js = require("@eslint/js");

module.exports = [
  js.configs.recommended,
  {
    ignores: ["docs/**"]  // ← ignore frontend files
  },
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        ...globals.node,
        ...globals.jest,    // ← adds jest globals
      }
    },
    rules: {}
  }
];