'use strict';

const path = require('path');

module.exports = () => {
  return async function proxy_umi_resources(ctx, next) {
    // 检查请求的是否是 umi 的静态资源
    const url = ctx.url;
    const extName = path.extname(url);
    if (url === '/index.css') {
      return await next();
    }

    if (/\.(?:js|css|map|jpg)$/.test(extName)) {
      // ctx.addHeader('Content-Type', mime.lookup(extName));
      // 读取静态文件目录
      return ctx.redirect('http://127.0.0.1:8000' + ctx.url);
    }
    await next();
  };
};
