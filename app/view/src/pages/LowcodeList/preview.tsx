import ReactDOM from 'react-dom';
import React, { useState, useCallback, useEffect } from 'react';
import { request } from 'umi';
import { message, Menu } from 'antd';
import { Loading } from '@alifd/next';
import { buildComponents, assetBundle, AssetLevel, AssetLoader } from '@alilc/lowcode-utils';
import ReactRenderer from '@alilc/lowcode-react-renderer';
import { injectComponents } from '@alilc/lowcode-plugin-inject';
import { getDefaultSchemaId, getSchema, getLowcodePageList } from '@/services/lowcode';

export default () => {
  const [data, setData] = useState({});

  async function onClick(val) {
    console.info('===onClick===>', val);
    const { key }  = val;
    const schemaObj = await getSchema(key);
    const { componentsMap, componentsTree } = schemaObj;
    const schema = componentsTree[0];
    const libraryMap = {};
    const libraryAsset = [];

    const packages = JSON.parse(window.localStorage.getItem('packages') || '');
    packages.forEach(({ package: _package, library, urls, renderUrls }) => {
      libraryMap[_package] = library;
      if (renderUrls) {
        libraryAsset.push(renderUrls);
      } else if (urls) {
        libraryAsset.push(urls);
      }
    });
    const components = await injectComponents(buildComponents(libraryMap, componentsMap));

    setData({
      ...data,
      components,
      schema,
    });
  };
  async function init() {
    // 1. 加载所有的 schema
    const schemas = await getLowcodePageList();

    // 1. 找到默认的 schema

    console.info('s=====', schemas);
    const defaultSchema = schemas[0].schema;

    // 2. 加载 schema
    console.info('=========', defaultSchema);

    const packages = JSON.parse(window.localStorage.getItem('packages') || '');
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
    const components = await injectComponents(buildComponents(libraryMap, componentsMap));

    setData({
      schema,
      schemas,
      components,
    });
  }

  const { schema, components, schemas } = data;

  if (!schema || !components ||!schemas) {
    init();
    return <Loading fullScreen />;
  }



  return (
    <div className="lowcode-plugin-sample-preview">
    {schemas.length > 0 && <Menu
      style={{ width: '100%'}}
      defaultSelectedKeys={[`${schemas[0].id}`]}
      mode='horizontal'
      theme='light'
    >
      {schemas.map((schema) => {
        return (
          <Menu.Item key={schema.id} onClick={onClick}>
            {schema.name}
          </Menu.Item>
        );
      })}
      </Menu>
      }

      <ReactRenderer
        className="lowcode-plugin-sample-preview-content"
        schema={schema}
        appHelper={{
          request,
          message,
        }}
        components={components}
      />
    </div>
  );
};

