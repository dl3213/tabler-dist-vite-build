/**
 * 生产环境 HTTP 服务器（含 IP 白名单）
 *
 * 使用方式：
 *   1. 先执行 npm run build 构建项目
 *   2. 再执行 node server.js 启动服务
 *
 * 环境变量配置（.env 文件）：
 *   PORT=4000              - 监听端口，默认 4000
 *   IP_WHITELIST=...       - 白名单 IP，逗号分隔
 */

import { createServer } from 'http';
import { readFileSync, existsSync, statSync } from 'fs';
import { extname, join, normalize } from 'path';
import { loadWhitelist, isIPAllowed, getClientIP } from './src/ip-whitelist.js';

// ====== 读取 .env 配置 ======
function loadEnvFile() {
  try {
    const content = readFileSync('.env', 'utf-8');
    const env = {};
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      env[key] = val;
    }
    return env;
  } catch {
    return {};
  }
}

const _env = loadEnvFile();

// ====== 配置 ======
const PORT = parseInt(process.env.PORT || _env.PORT || '4000', 10);
const ROOT = normalize(join(import.meta.dirname, './dist'));
const WHITELIST = loadWhitelist(_env.IP_WHITELIST || '');

// ====== MIME 类型映射 ======
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
  '.ttf':  'font/ttf',
  '.eot':  'application/vnd.ms-fontobject',
  '.pdf':  'application/pdf',
  '.webp': 'image/webp',
};

// ====== 静态文件服务 ======
function serveFile(res, filePath) {
  try {
    const content = readFileSync(filePath);
    const ext = extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found');
  }
}

// ====== 创建 HTTP 服务 ======
const server = createServer((req, res) => {
  // 1. IP 白名单检查
  const clientIP = getClientIP(req);
  const ip = clientIP.replace(/^::ffff:/, '');
  if (!isIPAllowed(ip, WHITELIST)) {
    console.warn(`[IP白名单] 拒绝访问: ${ip} ${req.url}`);
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403 Forbidden: 您的 IP 不在访问白名单中');
    return;
  }

  // 2. 解析请求路径
  let pathname = decodeURIComponent(new URL(req.url, `http://${req.headers.host}`).pathname);

  // 默认指向 index.html
  if (pathname === '/') pathname = '/index.html';

  const filePath = join(ROOT, pathname);

  // 3. 安全检查：防止目录穿越
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403 Forbidden');
    return;
  }

  // 4. 检查文件是否存在
  if (!existsSync(filePath) || !statSync(filePath).isFile()) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found');
    return;
  }

  // 5. 提供文件
  serveFile(res, filePath);
});

// ====== 启动 ======
server.listen(PORT, () => {
  console.log(`[服务器] 已启动 http://localhost:${PORT}`);
  console.log(`[服务器] 静态目录: ${ROOT}`);
  console.log(`[服务器] 白名单: ${_env.IP_WHITELIST || '(仅本地)'}`);
});
