// https://nuxt.com/docs/api/configuration/nuxt-config

import eslint from 'vite-plugin-eslint'

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  typescript: {
    // 启用项目启动运行或构建时自动类型检查
    typeCheck: true,
    // 严格模式
    strict: true
  },
  css: ['@/assets/styles/reset.css'],
  // vite 构建工具配置
  vite: {
    // vite 插件配置
    plugins: [
      // 运行或构建项目时，能够自动执行 ESLint 代码检查和修复的插件
      eslint({
        // 缓存现在可以正确识别文件更改，以减少执行时间
        cache: false,
        // 开启自动修复
        fix: true,
        // 打印警告信息
        emitWarning: true,
        // 发生警告不停止构建继续执行
        failOnWarning: false,
        // 打印错误信息
        emitError: true,
        // 发生错误停止构建
        failOnError: true,
        // 指定排除检查的文件和目录
        exclude: ['**/node_modules/**', '**/dist/**', '**/public/**', '**/.nuxt/**', '**/.output/**', '**/.nitro/**', '**/.data/**'],
        // 指定要执行检查的文件和目录
        include: ['./**/*.ts', './**/*.tsx', './**/*.js', './**/*.jsx', './**/*.vue', './*.ts', './*.tsx', './*.js', './*.jsx', './*.vue']
      })
    ],
    css: {
      // css 预处理器配置选项
      preprocessorOptions: {
        // sass 预处理器
        scss: {
          additionalData: `@use "@/assets/styles/global.scss" as *;`
        }
      }
    }
  }
})
