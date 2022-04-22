import React, { useEffect, useRef, useCallback, useState } from 'react';
import { init, plugins, common, skeleton, config } from '@alilc/lowcode-engine';
import registerPlugins from '@/components/Lowcode/plugin';
import EditorView from '@/components/Lowcode/EditorView';

import { getLowcodePageList } from '@/services/lowcode';

import '@/components/Lowcode/universal/global.scss';

const LowcodePageList = () => {
  const [hasPluginInited, setHasPluginInited] = useState(false);
  // const params = useParams<{schemaId: string}>();

  const init = useCallback(async () => {
    // 获取默认第一个 schema
    const result = await getLowcodePageList();
    const schema = result[0]?.schema || {};
    /*
    if (result.success && result.data.length > 0) {
      // schemaId = result.data[0].id;
      // location.href = `lowcode/edit/${schemaId}`
      schema = res
    }
    */

    console.info('getSchema----', schema);
    await registerPlugins(schema.componentsTree?.[0]);

  }, []);
  // 1. 找到当前默认的 schemaId
  useEffect(() => {
    // console.info('======>', params);
    // 现在插件和 schema 是混在一起的， 是不是可以分开
    init().then(() => {
      setHasPluginInited(true);
    }).catch(err => {
      console.error(err)
      location.reload();
    });
    /*
    // 暂时不销毁，如果发现插件已经注册, 重新刷新页面
    return () => {
      plugins.dispose().then(() => {
        console.info('====>plugins destroy success');
      });
    }
    */
  }, [])

  return hasPluginInited && <EditorView/>
};

export default LowcodePageList;

