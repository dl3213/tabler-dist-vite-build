import { defineConfig } from 'vite'
import { resolve } from 'path' 

export default defineConfig({
  base: './',
  alias: {
    // 配置目录别名
    '@': resolve(__dirname, 'src'),
    'views': resolve(__dirname, 'src/views'),
    'utils': resolve(__dirname, 'src/utils'),
  },

  // 开发服务器配置
  server: {
    hmr: true,
    host: true,
    open: false,
    port: 3000,
  },

  // 构建输出配置
  build: {
      outDir: './dist',
      target: 'modules',
      assetsDir: 'assets',
      assetsInlineLimit: 360000, 
      rollupOptions: {
        output: {
          // 控制 JS 文件名
          entryFileNames: 'assets/[name].js',
          // 控制 CSS 和静态资源文件名
          assetFileNames: 'assets/[name].[ext]'
        }
      },
      manifest: false // 关闭 manifest 文件生成
  }
})
