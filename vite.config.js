import { defineConfig } from 'vite'
import { resolve } from 'path'
import { createHtmlPlugin } from 'vite-plugin-html';  
import fs from 'fs';
import path from 'path';

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
    port: 4000,
  },

  // 构建输出配置
  build: {
    outDir: './dist',
    target: 'modules',
    assetsDir: 'assets',
    assetsInlineLimit: 360000,
    rollupOptions: {
      input: {
        main: './src/main.js', // 原始入口文件
      },
      output: {
        // 控制 JS 文件名
        entryFileNames: 'assets/[name].js',
        // 控制 CSS 和静态资源文件名
        assetFileNames: 'assets/[name].[ext]'
      }
    },
    manifest: false // 关闭 manifest 文件生成
  },
  plugins: [
    // createHtmlPlugin({
    //   minify: true,
    //   inject: {
    //     data: {
    //       title: 'My App',

    //     },
    //     tags: [

    //     ]
    //   },
    //   pages: [
    //     {
    //       filename: 'index.html',
    //       template: 'index.html', 
    //       injectOptions: {
    //         data: { 
    //           home: fs.readFileSync(path.resolve(__dirname, 'src/page/home.html'), 'utf-8'),
    //         },
    //       }

    //     },
    //   ]
    // }),
  ],

})
