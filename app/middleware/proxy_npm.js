'use strict';

const path = require('path');
const fs = require('fs/promises');
const crypto = require('crypto');
const mime = require('mime-types')

async function loadFile(fileName) {
  const extName = path.extname(fileName);
  const stats = fs.stat(fileName)
  const buffer = await fs.readFile(fileName)

  const obj = {};
  obj.buffer = buffer;
  obj.maxAge = 0;
  obj.type = mime.lookup(extName) || 'application/octet-stream'
  obj.mtime = stats.mtime
  obj.length = stats.size
  obj.md5 = crypto.createHash('md5').update(buffer).digest('base64')
  return obj
}

module.exports = () => {
  return async function proxy_npm_resources(ctx, next) {
    // 检查请求的是否是 umi 的静态资源
    if (ctx.method !== 'HEAD' && ctx.method !== 'GET') return await next()

    const baseDir = path.join(ctx.app.baseDir, 'node_modules');

    const url = ctx.url;

    // console.info('====>', url);
    if (url.indexOf('/npm') === 0) {
      const parts = url.split('/');
      parts.shift();
      parts.shift();
      const packageName = parts.shift();
      const [name, version] = packageName.split(/@(?=\d)/);
      // 1. 查找 node_modules 下的包
      const packageJsonPath = path.join(baseDir, name, 'package.json');

      // console.info('=====npm=====>', name, version, parts.join('/'));
      try {
        const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));
        if (packageJson.version !== version) {
          ctx.logger.warn(`[NpmProxy] dependency module ${packageName} version inconsistency, real version ${packageJson.version}`)
        }
        const file = await loadFile(path.join(baseDir, name, parts.join(path.sep)));
        ctx.status = 200;
        ctx.set('content-type', file.type);
        ctx.set('content-length', file.length);
        ctx.set('cache-control', file.cacheControl || 'public, max-age=' + file.maxAge)

        if (file.md5) {
          ctx.set('content-md5', file.md5);
          ctx.set('etag', file.md5);
        }

        ctx.body = file.buffer;
        return;

      } catch(e) {
        ctx.logger.error(`[NpmProxy] Not found dependency ${packageName} ${e.message}`);
      }
    }

    await next();
  };
};

// const str1 = 'antd-protable-component@0.1.3';
// const str2 = '@alilc/lowcode-materials@1.0.3';

