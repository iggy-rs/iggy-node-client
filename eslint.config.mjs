import { builtinModules } from "module"

// import jsLint from "@eslint/js"
// import stylistic from "@stylistic/eslint-plugin"
// import pluginSimpleImportSort from "eslint-plugin-simple-import-sort"
// import globals from "globals"
import tsLint from "typescript-eslint"

export default [
  // config parsers
  {
    files: ["**/*.{js,mjs,cjs,ts}"]
  },
  // {
  //     files: ["*.vue", "**/*.vue"],
  //     languageOptions: {
  //         parserOptions: {
  //             parser: "@typescript-eslint/parser",
  //             sourceType: "module"
  //         }
  //     }
  // },
  // config envs
  {
    languageOptions: {
      // globals: {
      //   // ...globals.browser,
      //   ...globals.node
      // }
    }
  },
  // rules
  // jsLint.configs.recommended,
  ...tsLint.configs.recommended,
  // ...vueLint.configs["flat/essential"],
  // ...fixupConfigRules(pluginReactConfig),
  {
    rules: {
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "separate-type-imports"
        }
      ]
    }
  },
  {
    plugins: {
      // "simple-import-sort": pluginSimpleImportSort
    },
  },

  // see: https://eslint.style/guide/getting-started
  // see: https://github.com/eslint-stylistic/eslint-stylistic/blob/main/packages/eslint-plugin/configs/disable-legacy.ts
  // stylistic.configs["disable-legacy"],
  // stylistic.configs.customize({
  //   indent: 4,
  //   quotes: "double",
  //   semi: false,
  //   commaDangle: "never",

  //   jsx: true
  // }),

  {
    // https://eslint.org/docs/latest/use/configure/ignore
    ignores: [
      // only ignore node_modules in the same directory as the configuration file
      "node_modules",
      "dist",
      // so you have to add `**/` pattern to include nested directories (for example if you use pnpm workspace)
      // "**/node_modules",
      // also you can add a new rule to revert a ignore
      // "!./packages/manual-add-lib/node_modules/local-lib.js"
    ]
  }
]
