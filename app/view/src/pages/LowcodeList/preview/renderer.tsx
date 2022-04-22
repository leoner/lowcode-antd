import ReactDOM from 'react-dom';
import React, { useState, useCallback, useEffect } from 'react';
import { request } from 'umi';
import { message, Layout, Menu } from 'antd';
import { Loading } from '@alifd/next';
import { buildComponents, assetBundle, AssetLevel, AssetLoader } from '@alilc/lowcode-utils';
import ReactRenderer from '@alilc/lowcode-react-renderer';
import { injectComponents } from '@alilc/lowcode-plugin-inject';
import { getDefaultSchemaId, getSchema, getLowcodePageList } from '@/services/lowcode';

export default (props) => {

  const { id } = props;
  const [data, setData] = useState<{schema: any, components: any}>();

  const init = useCallback(async (id) => {
    // 1. 加载所有的 schema
    const defaultSchema = await getSchema(id);

    // 2. 加载 schema
    console.info('=========', defaultSchema);

    const assets = await request('/public/assets.json');
    console.info('====a==', assets);
    // const packages = JSON.parse(window.localStorage.getItem('packages') || '');
    const { packages } = assets;
    // const projectSchema = JSON.parse(window.localStorage.getItem('projectSchema') || '');

    const { componentsMap: componentsMapArray, componentsTree } = defaultSchema;
    const componentsMap: any = {};
    componentsMapArray.forEach((component: any) => {
      componentsMap[component.componentName] = component;
    });

    const schema = componentsTree[0];

    const libraryMap = {};
    const libraryAsset = [];
    packages.forEach(({ package: _package, library, urls, renderUrls }) => {
      libraryMap[_package] = library;
      if (renderUrls) {
        libraryAsset.push(renderUrls);
      } else if (urls) {
        libraryAsset.push(urls);
      }
    });

    const vendors = [assetBundle(libraryAsset, AssetLevel.Library)];

    // TODO asset may cause pollution
    const assetLoader = new AssetLoader();
    await assetLoader.load(libraryAsset);
    const components = await injectComponents(buildComponents(libraryMap, componentsMap, null));
    console.info('schema---', schema);
    setData({
      schema,
      components,
    });

  }, []);

  useEffect(() => {
    console.info('renderId--', id);
    init(id);
  }, [id]);

  return (
    <>
    { data?.schema && (<ReactRenderer
      className="lowcode-plugin-sample-preview-content"
      schema={data.schema}
      appHelper={{
        request,
        message,
      }}
      components={data.components}
    />)
   }
   </>
  );
};