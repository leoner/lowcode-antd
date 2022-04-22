import ReactDOM from 'react-dom';
import React, { useState, useCallback, useEffect } from 'react';
import { request } from 'umi';
import { message, Layout, Menu } from 'antd';
import { Loading } from '@alifd/next';
import { buildComponents, assetBundle, AssetLevel, AssetLoader } from '@alilc/lowcode-utils';
import ReactRenderer from '@alilc/lowcode-react-renderer';
import { injectComponents } from '@alilc/lowcode-plugin-inject';
import { getDefaultSchemaId, getSchema, getLowcodePageList } from '@/services/lowcode';
import  Renderer from './preview/renderer';
import './preview.less';

const { Header, Content, Footer } = Layout;

export default () => {
  const [schemas, setSchemas] = useState([]);
  const [id, setId] = useState();


  useEffect(() => {
    async function getSchemas() {
      const _schemas = await getLowcodePageList();
      setSchemas(_schemas);
      setId(_schemas[0]?.id);
    };
    getSchemas();
  }, []);

  async function onSelect(val) {
    const { key }  = val;
    setId(key);
  };


  return (
    <Layout className="layout">
      <Header>
        <div className="logo" />
        {schemas.length > 0 && <Menu
          style={{ width: '100%'}}
          defaultSelectedKeys={[`${schemas[0].id}`]}
          mode='horizontal'
          theme='dark'
        >
          {schemas.map((schema) => {
            return (
              <Menu.Item key={schema.id} onClick={onSelect}>
                {schema.name}
              </Menu.Item>
            );
          })}
        </Menu>
      }
      </Header>
      <Content style={{ padding: '0 50px' }}>
        { id && <Renderer id={id}/>}
      </Content>
      <Footer style={{ textAlign: 'center' }}> 低代码平台 ©2022</Footer>
    </Layout>
  );
};

