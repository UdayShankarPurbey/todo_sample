import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import angularPlugin from "@angular-eslint/eslint-plugin";
import templatePlugin from "@angular-eslint/eslint-plugin-template";
import templateParser from "@angular-eslint/template-parser";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

export default [
  // Ignore node_modules, dist, coverage
  { ignores: ["node_modules/**", "dist/**", ".angular/**", "coverage/**"] },

  // TypeScript files
  {
    files: ["**/*.ts"],
    ignores: ["**/*.spec.ts"],
    languageOptions: {
      parser: tsParser, // <-- must be imported module
      globals: {
        console: "readonly",
        Event: "readonly",
        window: "readonly",
        document: "readonly"
      }
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      "@angular-eslint": angularPlugin,
      prettier: prettierPlugin
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...angularPlugin.configs.recommended.rules,
      ...prettierConfig.rules,
      "prettier/prettier": "error",
      "@angular-eslint/component-class-suffix": ["error", { suffixes: ["Component"] }],
      "@angular-eslint/directive-class-suffix": ["error", { suffixes: ["Directive"] }],
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }]
    }
  },

  // Jasmine spec files
  {
    files: ["**/*.spec.ts"],
    languageOptions: {
      parser: tsParser, // <-- imported parser module
      globals: {
        describe: "readonly",
        it: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        expect: "readonly",
        console: "readonly",
        Event: "readonly"
      }
    },
    rules: {
      "no-undef": "off"
    }
  },

  // Angular HTML templates
  {
    files: ["**/*.html"],
    languageOptions: {
      parser: templateParser, // <-- imported parser module
    },
    plugins: {
      "@angular-eslint/template": templatePlugin,
      prettier: prettierPlugin
    },
    rules: {
      ...templatePlugin.configs.recommended.rules,
      "prettier/prettier": "error"
    }
  }
];
