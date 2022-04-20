import React, { useEffect, useCallback, useState } from 'react';
import { useParams } from 'umi';
import { Menu, Button, message } from 'antd';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { getLowcodePageList, addSchema, getSchema } from '@/services/lowcode';

import {
  config,
  ILowCodePluginContext,
  plugins,
  project,
} from '@alilc/lowcode-engine';

import defaultSchema from './schema.json';

function getDefaultSchema() {
  return {
    ...defaultSchema,
    id: `page_${Date.now()}`,
  };
}

export default () => {
  const [ schemas , setSchemas ] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const initSchemas = useCallback(async () => {
    const result = await getLowcodePageList();
    setSchemas(result);
    const defaultSchemaObj = result[0];
    config.set('currentPage', defaultSchemaObj.id);
    console.info('=====defaultId=', defaultSchemaObj.id);
  }, []);

  const handleAdd = async (fields) => {
    const hide = message.loading('正在添加');
    try {
      const result = await addSchema(fields);
      hide();
      message.success('添加成功');
      return result.id;
    } catch (error) {
      hide();
      message.error('添加失败，稍后重试');
      return false;
    }
  };

  useEffect(() => {
    initSchemas();
  }, []);

  const onClick = async (val) => {
    // 切换
    const schema = await getSchema(val.key);

    project.removeDocument(project.currentDocument);
    project.openDocument(schema?.componentsTree?.[0] || getDefaultSchema());
    config.set('currentPage', val.key);
    // location.href=`/lowcode/edit/${val.key}`;
  };
  const openCreatePage = async () => {
    setModalVisible(true);
  };

  return (
    <>
    {schemas.length > 0 && <Menu
      style={{ width: 256 }}
      defaultSelectedKeys={[`${schemas[0].id}`]}
      mode='inline'
      theme='light'
    >
      {schemas.map((schema) => {
        return (
          <Menu.Item key={schema.id}  onClick={onClick}>
            {schema.name}
          </Menu.Item>
        );
      })}
    </Menu>
    }
    <Button onClick={openCreatePage}> 新建页面</Button>
    <ModalForm
        title='新建页面'
        width="400px"
        visible={modalVisible}
        onVisibleChange={setModalVisible}
        onFinish={async (value) => {
          const id = await handleAdd(value);
          // 伪造一个空的 schema
          schemas.push({
            id,
            name: value.name,
            content: {
              componentsTree: [],
            },
          });
          setSchemas([...schemas]);
          setModalVisible(false);
        }}
      >

        <ProFormText
          rules={[
            {
              required: true,
              message: '必须输入页面名字',
            },
          ]}
          label="页面名字"
          width="md"
          name="name"
        />
         <ProFormText
          rules={[
            {
              required: true,
              message: '必须输入路由',
            },
          ]}
          label="路由"
          width="md"
          name="router"
        />
      </ModalForm>
    </>
  );
};
