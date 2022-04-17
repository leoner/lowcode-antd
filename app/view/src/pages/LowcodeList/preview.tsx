import ReactDOM from 'react-dom';
import React, { useState, useCallback, useEffect } from 'react';
import { useParams } from 'umi';
import { Loading } from '@alifd/next';
import { buildComponents, assetBundle, AssetLevel, AssetLoader } from '@alilc/lowcode-utils';
import ReactRenderer from '@alilc/lowcode-react-renderer';
import { injectComponents } from '@alilc/lowcode-plugin-inject';
import { getDefaultSchemaId, getSchema  } from '@/services/lowcode';

export default () => {
  const [data, setData] = useState({});
  const params = useParams<{schemaId: string}>();


  async function init() {
    // 1. 默认找到 schemaId
    let schemaId = params.schemaId;
    if (!schemaId) {
      schemaId = await getDefaultSchemaId();
    }

    // 2. 加载 schema
    const projectSchema = await getSchema(schemaId);

    console.info('=========', projectSchema);

    const packages = JSON.parse(window.localStorage.getItem('packages') || '');
    // const projectSchema = JSON.parse(window.localStorage.getItem('projectSchema') || '');

    const { componentsMap: componentsMapArray, componentsTree } = projectSchema;
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
    const components = await injectComponents(buildComponents(libraryMap, componentsMap));

    setData({
      schema,
      components,
    });
  }

  const { schema, components } = data;

  if (!schema || !components) {
    init();
    return <Loading fullScreen />;
  }

  return (
    <div className="lowcode-plugin-sample-preview">
      <ReactRenderer
        className="lowcode-plugin-sample-preview-content"
        schema={schema}
        components={components}
      />
    </div>
  );
};

