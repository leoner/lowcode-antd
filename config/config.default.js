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
  config.middleware = ['proxyUmi'];

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
    }
  };

  return {
    ...config,
    ...userConfig,
  };
};
