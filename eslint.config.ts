import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  // 全局忽略文件夹
  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  // Vue 基础规则
  pluginVue.configs['flat/essential'],

  // TypeScript 推荐规则
  vueTsConfigs.recommended,

  // 关闭 Prettier 格式冲突
  skipFormatting,

  // ✅ 单独的规则层（类型允许），这里写自定义规则！
  {
    name: 'custom-rules',
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
)
