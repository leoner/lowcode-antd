import * as React from 'react';

import { message, Form, Input, Modal } from 'antd';
import { Dialog, ConfigProvider, Box } from '@alifd/next';
import type { ProFormInstance } from '@ant-design/pro-form';
import ProForm, {
  ModalForm,
  ProFormText,
  ProFormDateRangePicker,
  ProFormSelect,
} from '@ant-design/pro-form';

import {
  FileAddOutlined,
} from '@ant-design/icons';
import { Node } from '@alilc/lowcode-designer';

import { createBlock, listBlocks } from '@/services/block';


interface SaveAsBlockProps {
  node: Node;
}

const SaveAsBlock = (props: SaveAsBlockProps ) => {
  const { node } = props;
  const formRef = React.useRef<
    ProFormInstance<{
      name: string;
      title: string;
    }>
  >();

  return (
    <ProForm<{
      name: string;
      title: string;
    }>
      onFinish={async (values) => {
        console.info('values---', values, node.componentName, node.schema);
        message.success('提交成功');
        await createBlock({
          ...values,
          schema: JSON.stringify(node.schema),
        });
        return true;
      }}
      formRef={formRef}
      autoFocusFirstInput
    >
      <ProForm.Group>
        <ProFormText
          width="md"
          name="name"
          required
          label="区块名称"
          tooltip="最长为 24 位"
          placeholder="请输入区块名称"
          rules={[{ required: true, message: '这是必填项' }]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          width="md"
          name="title"
          required
          label="区块标题"
          tooltip="最长为 24 位"
          placeholder="请输入区块标题"
          rules={[{ required: true, message: '这是必填项' }]}
        />
      </ProForm.Group>
    </ProForm>
  );

}

const SaveAsBlockV2 = (props: SaveAsBlockProps ) => {
  const { node } = props;

  return (
    <ModalForm<{
      name: string;
      company: string;
    }>
      title="区块"
      visible={true}
      autoFocusFirstInput
      modalProps={{
        onCancel: () => console.log('run'),
      }}
      onFinish={async (values) => {
        console.log(values.name);
        message.success('提交成功');
        return true;
      }}
    >
      <ProForm.Group>
        <ProFormText
          width="md"
          name="name"
          label="区块名称"
          tooltip="最长为10位"
          placeholder="请输入区块名称"
        />
      </ProForm.Group>
      </ModalForm>
  );

}

export default {
  name: 'add',
  content: {
    icon: <FileAddOutlined/>,
    title: '保存区块',
    action(node: Node) {
      Dialog.show({
        title: '区块',
        content: <SaveAsBlock node={node}/>,
        footer: false,
      });
    },
  },

  important: true,
}



/*
<div className="lc-borders-action">
    <ModalForm<{
      name: string;
      company: string;
    }>
      title=""
      trigger={
        <FileAddOutlined />
      }
      autoFocusFirstInput
      modalProps={{
        onCancel: () => console.log('run'),
      }}
      onFinish={async (values) => {
        console.log(values.name);
        message.success('提交成功');
        return true;
      }}
    >
      <ProForm.Group>
        <ProFormText
          width="md"
          name="name"
          label="区块名称"
          tooltip="最长为10位"
          placeholder="请输入区块名称"
        />
      </ProForm.Group>
      </ModalForm>

    </div>
    */