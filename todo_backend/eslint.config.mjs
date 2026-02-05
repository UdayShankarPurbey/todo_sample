// eslint.config.js
import js from "@eslint/js";
import globals from "globals";

export default [
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "build/**"
    ],
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs", 
      globals: {
        ...globals.node,  
        ...globals.es2021
      }
    },
    rules: {
      ...js.configs.recommended.rules,

      // CommonJS-friendly rules
      "no-console": "off",
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }]
    }
  }
];
