/* eslint valid-jsdoc: "off" */

'use strict';

const path = require('path');
/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1649649738641_1329';

  // add your middleware config here
  config.middleware = ['proxyNpm', 'proxyUmi'];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
    static: {
      prefix: '/public/',
      dir: path.join(appInfo.baseDir, 'app/public'),
    },
    view: {
      defaultViewEngine: 'nunjucks',
      mapping: {
        '.tpl': 'nunjucks',
      },
      root: path.join(appInfo.baseDir, 'app/view'),
    },

    orm: {
      port: process.env.MYSQL_PORT,
      client: 'mysql2',
      database: 'lowcode',
      user: 'lowcode',
      password: 'lowcode',
      host: '127.0.0.1',
      baseDir: 'model',
      logger: {
        logQuery(sql, duration, opts) {
          console.info('=====s=ql------', sql);
        },            // 数据库查询
        logQueryError(err, sql, duration, opts) {},  // 数据库查询失败
        logMigration(name) {},                       // 迁移任务
      },
    },
    assets: {
      publicPath: '/public/',
      devServer: {
        debug: true,
        command: 'cross-env REACT_APP_ENV=dev MOCK=none APP_ROOT=$PWD/app/view USE_WEBPACK_5=1 UMI_ENV=dev umi dev',
        port: 8000,
        env: {
          APP_ROOT: path.join(__dirname, 'app/view'),
          BROWSER: 'none',
          ESLINT: 'none',
          SOCKET_SERVER: 'http://127.0.0.1:8000',
          PUBLIC_PATH: 'http://127.0.0.1:8000',
        },
      },
    },
    security: {
      csrf: false,
    },
  };


  return {
    ...config,
    ...userConfig,
  };
};
