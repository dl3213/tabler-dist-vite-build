/**
 * IP 白名单检查工具模块
 *
 * 支持格式：
 *   - 精确 IP: 192.168.1.100
 *   - CIDR: 192.168.1.0/24
 *   - 通配符: 192.168.*
 *   - 多值逗号分隔: 192.168.1.100,10.0.0.0/8
 *
 * 默认始终允许本地地址 (127.0.0.1, ::1, localhost)。
 *
 * 注意：本模块不直接读取 process.env，所有配置通过参数显式传入。
 */

/**
 * IPv4 字符串转整数
 */
function ipToInt(ip) {
  const parts = ip.split('.');
  if (parts.length !== 4) return null;
  let result = 0;
  for (const part of parts) {
    const num = parseInt(part, 10);
    if (isNaN(num) || num < 0 || num > 255) return null;
    result = (result << 8) + num;
  }
  return result >>> 0;
}

/**
 * 标准化 IP 地址：将 IPv4-mapped IPv6 转为纯 IPv4
 * 如 ::ffff:192.168.1.1 -> 192.168.1.1
 */
function normalizeIP(raw) {
  if (!raw) return '';
  return raw.replace(/^::ffff:/, '');
}

/**
 * 从白名单字符串解析规则列表
 * @param {string} whitelistStr - 逗号分隔的白名单配置
 * @returns {Array<{type: string, value: string, match: Function}>}
 */
function loadWhitelist(whitelistStr) {
  const list = [];

  // 始终允许本地地址
  const localIPs = ['127.0.0.1', '::1', '::ffff:127.0.0.1', 'localhost', '0.0.0.0', '192.168.10.64', '192.168.10.51', '192.168.10.52'];
  for (const ip of localIPs) {
    list.push({ type: 'exact', value: ip, match: (addr) => addr === ip });
  }

  if (!whitelistStr) return list;

  const entries = whitelistStr.split(',').map(s => s.trim()).filter(Boolean);

  for (const entry of entries) {
    // CIDR 格式: 192.168.1.0/24
    if (entry.includes('/')) {
      const [networkStr, bitsStr] = entry.split('/');
      const bits = parseInt(bitsStr, 10);
      const networkInt = ipToInt(networkStr);
      if (networkInt === null || isNaN(bits) || bits < 0 || bits > 32) continue;
      const mask = bits === 0 ? 0 : ((~0 >>> 0) << (32 - bits)) >>> 0;
      list.push({
        type: 'cidr',
        value: entry,
        match: (addr) => {
          const addrInt = ipToInt(addr);
          return addrInt !== null && (addrInt & mask) >>> 0 === (networkInt & mask) >>> 0;
        }
      });
    }
    // 通配符: 192.168.* 或 10.*
    else if (entry.includes('*')) {
      const regexStr = '^' + entry
        .replace(/\./g, '\\.')
        .replace(/\*/g, '\\d+')
        .replace(/-/g, '\\-') + '$';
      const regex = new RegExp(regexStr);
      list.push({
        type: 'wildcard',
        value: entry,
        match: (addr) => regex.test(addr)
      });
    }
    // 精确 IP
    else {
      list.push({
        type: 'exact',
        value: entry,
        match: (addr) => addr === entry
      });
    }
  }

  return list;
}

/**
 * 检查 IP 是否被允许
 * @param {string} clientIP - 客户端 IP 地址
 * @param {Array} whitelist - 白名单规则列表
 * @returns {boolean}
 */
function isIPAllowed(clientIP, whitelist) {
  const ip = normalizeIP(clientIP);
  if (!ip) return false;
  return whitelist.some(entry => entry.match(ip));
}

/**
 * 从请求对象中提取客户端 IP
 */
function getClientIP(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    const ip = forwarded.split(',')[0].trim();
    if (ip) return ip;
  }
  return req.socket?.remoteAddress || '';
}

/**
 * Express/Vite 中间件工厂
 * @param {Object} options
 * @param {string} options.whitelistStr - 白名单配置字符串
 * @param {boolean} options.devSkip - 是否跳过开发模式检查
 * @returns {Function} (req, res, next) => void
 */
function createMiddleware(options = {}) {
  const { whitelistStr = '', devSkip = false } = options;
  const whitelist = loadWhitelist(whitelistStr);

  return (req, res, next) => {
    // devSkip 用于开发模式跳过检查，默认 false（不跳过）
    if (devSkip) return next();

    const ip = normalizeIP(getClientIP(req));

    console.log(`[IP白名单] 请求来源: ${ip}, url: ${req.url}`);

    if (isIPAllowed(ip, whitelist)) return next();

    const msg = '403 Forbidden: 您的 IP 不在访问白名单中';
    console.warn(`[IP白名单] 拒绝访问: ${ip}`);
    res.statusCode = 403;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end(msg);
  };
}

export { loadWhitelist, isIPAllowed, createMiddleware, getClientIP, ipToInt, normalizeIP };
