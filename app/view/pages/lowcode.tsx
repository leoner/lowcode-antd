import React, { useEffect } from 'react';
import { init, plugins } from '@alilc/lowcode-engine';

import registerPlugins from './components/plugin';

import './components/universal/global.scss';

const preference = new Map();
preference.set('DataSourcePane', {
  importPlugins: [],
  dataSourceTypes: [
    {
      type: 'fetch',
    },
    {
      type: 'jsonp',
    }
  ]
});

export default () => {
  useEffect(() => {
    registerPlugins().then(() => {
      init(document.getElementById('lce-container')!, {
        // designMode: 'live',
        // locale: 'zh-CN',
        enableCondition: true,
        enableCanvasLock: true,
        // 默认绑定变量
        supportVariableGlobally: true,
        // simulatorUrl 在当 engine-core.js 同一个父路径下时是不需要配置的！！！
        // 这里因为用的是 alifd cdn，在不同 npm 包，engine-core.js 和 react-simulator-renderer.js 是不同路径
        simulatorUrl: [
          'https://alifd.alicdn.com/npm/@alilc/lowcode-react-simulator-renderer@latest/dist/css/react-simulator-renderer.css',
          'https://alifd.alicdn.com/npm/@alilc/lowcode-react-simulator-renderer@latest/dist/js/react-simulator-renderer.js'
        ]
      }, preference);

    });
  }, []);

  return (
    <div id="lce-container">
    </div>
  );
};
