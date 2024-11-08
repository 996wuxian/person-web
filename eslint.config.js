import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import eslintConfigPrettier from 'eslint-config-prettier' // 新增

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts,vue}'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  {
    files: ['**/*.vue', '**/*.js', '**/*.cjs'],
    languageOptions: { parserOptions: { parser: tseslint.parser }, globals: globals.node }
  },
  eslintConfigPrettier,
  {
    ignores: ['node_modules', '.nuxt', 'public', 'dist', '.output', '.data', '.nitro', '.cache'],
    rules: {
      'vue/multi-word-component-names': 'off'
    }
  }
]
