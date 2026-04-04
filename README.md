# NodeJs-runner

基于 Tabler UI 框架的 Vite 构建项目，用于快速开发后台管理界面。

## 📁 项目结构

```
tabler-dist-vite-build/
├── public/                      # 静态资源目录
│   ├── templates/               # 页面模板
│   │   ├── index/               # 首页相关模板
│   │   │   ├── home.html
│   │   │   ├── layout-*.html    # 各种布局模板
│   │   │   └── index.html
│   │   ├── modal/               # 模态框模板
│   │   └── ...                  # 其他功能模板
│   ├── tabler/                  # Tabler CSS/JS 框架
│   ├── js/                      # 公共 JS 库
│   │   └── common/common.js     # 通用工具函数
│   └── css/                     # 样式文件
├── src/                         # 源代码
│   ├── main.js                  # 主入口文件
│   └── page/home.html           # 主页内容
├── dist/                        # 构建输出目录
├── index.html                   # 主 HTML 入口
├── vite.config.js              # Vite 配置
├── package.json
└── .env                        # 环境变量
```

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 生产构建
npm run build

# 预览构建结果
npm run preview
```

## ⚙️ Vite 配置说明

`vite.config.js` 主要配置：

| 配置项 | 说明 |
|--------|------|
| `base: './'` | 使用相对路径，支持静态部署 |
| `server.port: 4000` | 开发服务器端口 |
| `build.outDir: './dist'` | 输出目录 |
| `build.target: 'modules'` | 编译目标 |
| `alias` | 路径别名配置 |

### 路径别名

```js
alias: {
  '@': resolve(__dirname, 'src'),
  'views': resolve(__dirname, 'src/views'),
  'utils': resolve(__dirname, 'src/utils'),
}
```

## 📝 环境变量

`.env` 文件配置后端 API 地址：

```env
VITE_API_URL = "http://192.168.10.62:8080"
```

## 🎨 技术栈

- **构建工具**: Vite 6.2
- **UI 框架**: Tabler (内嵌于 public/tabler/)
- **图标**: Tabler Icons
- **HTTP 库**: Axios
- **模板引擎**: Mustache

### 依赖包

| 包名 | 版本 | 用途 |
|------|------|------|
| vite | ^6.2.0 | 构建工具 |
| vite-plugin-html | ^3.2.2 | HTML 模板处理 |
| vite-plugin-glob | ^0.3.2 | Glob 导入支持 |
| vite-plugin-static-copy | ^2.3.0 | 静态资源拷贝 |
| @vitejs/plugin-legacy | ^6.0.2 | 兼容性支持 |
| mustache | ^4.2.0 | 模板引擎 |
| glob | ^11.0.1 | 文件匹配 |

## 📋 主要功能

### 1. SPA 应用架构
- 使用 iframe 作为主内容区
- 通过 `target-link` 属性切换页面
- 支持布局切换 (`layout-link`)

### 2. 动态菜单加载
```js
// 从后端加载菜单树
load_menu_base(apiUrl)  // 加载基础导航
load_menu(apiUrl)        // 加载完整菜单
menu_build()             // 绑定菜单点击事件
```

### 3. 主题定制
- 支持 Light/Dark 模式
- 12 种主题色可选
- 4 种字体系列
- 圆角半径可调

### 4. 公共工具函数 (common.js)

```js
// 表单处理
Common.formSetData(el, obj)    // 表单填充数据
Common.getFormData(formId)      // 获取表单数据

// 数字处理
Common.divideAndRound(num1, num2)  // 除法保留小数
numberAdd / numberSub              // 加减运算

// 模板引擎
Common.createTemplate(template)    // 创建模板
Common.templateId(id)              // 获取模板内容

// 响应式
checkBreakpoint()                  // 获取当前断点

// XLSX 下载
downloadXlsxWithPostRealUrl(url, body, callback)

// 弹窗提示
Common.alertSuccess(msg)
Common.alertDanger(msg)
```

## 📄 页面模板说明

### 布局模板
- `layout-vertical.html` - 垂直布局（默认）
- `layout-horizontal.html` - 水平布局
- `layout-boxed.html` - 盒式布局
- `layout-fluid.html` - 流式布局
- `layout-vertical-transparent.html` - 透明垂直布局
- `layout-rtl.html` - RTL 布局

### 首页模板
- `home.html` - 主页内容
- `index.html` - 带导航的首页框架

## 🔧 开发指南

### 添加新页面
1. 在 `public/templates/` 下创建 HTML 文件
2. 在菜单 API 中注册路由
3. 使用 `target-link` 属性链接到页面

### 使用公共组件
```html
<!-- 引入公共 JS -->
<script src="/public/js/common/common.js"></script>

<!-- 使用工具函数 -->
<script>
  Common.alertSuccess('操作成功');
</script>
```

### 调用后端 API
```js
import axios from '/public/js/axios.min.js';

axios.get(apiUrl + '/api/rest/v1/menu/tree')
  .then(response => {
    console.log(response.data);
  });
```

## 📦 构建输出

构建后生成的文件位于 `dist/` 目录：

```
dist/
└── assets/
    ├── main.js           # 打包后的入口 JS
    └── [name].[ext]      # 静态资源
```

## 🌐 部署说明

1. 执行 `npm run build`
2. 将 `dist/` 目录内容部署到 Web 服务器
3. 确保服务器支持 SPA 路由回退（若使用路由）
4. 配置后端 API 地址（`.env` 或环境变量）

---

*最后更新: 2026-04-02*
