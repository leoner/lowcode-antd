'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  static: {
    enable: true,
  },
  nunjucks: {
    enable: true,
    package: 'egg-view-nunjucks',
  },
  assets: {
    enable: true,
    package: 'egg-view-assets',
  },
  parameters: {
    enable: true,
    package: 'egg-parameters',
  },

  orm: {
    enable: true,
    package: 'egg-orm',
  },
  proxyNpm: {
    enable: true,
    package: 'egg-proxy-npm',
  },
};
