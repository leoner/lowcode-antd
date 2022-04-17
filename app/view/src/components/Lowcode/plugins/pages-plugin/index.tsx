import React, { useEffect, useCallback, useState } from 'react';
import { useParams } from 'umi';
import { Menu } from 'antd';
import { getLowcodePageList } from '@/services/lowcode';

export default () => {
  const [ schemas , setSchemas ] = useState([]);
  const params = useParams<{schemaId: string}>();
  const [ selectedKeys, setSelectedKeys] = useState([params.schemaId ]);

  const initSchemas = useCallback(async () => {
    const result = await getLowcodePageList();
    setSchemas(result.data);
  }, []);

  useEffect(() => {
    initSchemas();
  }, []);

  const onClick = (val) => {
    console.info('=click=>', val);
    setSelectedKeys([val.key]);
    location.href=`/lowcode/edit/${val.key}`;
  };

  return (
    <Menu
      style={{ width: 256 }}
      selectedKeys={selectedKeys}
      mode='inline'
      theme='light'
    >
      { (schemas.length > 0) && schemas.map((schema) => {
        return (
          <Menu.Item key={schema.id} onClick={onClick}>
            {schema.name}
          </Menu.Item>
        );
      })}
    </Menu>
  );
};
