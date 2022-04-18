import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Popconfirm } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { Link, FormattedMessage } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { getLowcodePageList, addSchema, updateSchema, deletePage} from '@/services/lowcode';

/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */

const handleAdd = async (fields) => {
  const hide = message.loading('正在添加');
  try {
    await addSchema(fields);
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败，稍后重试');
    return false;
  }
};
/**
 * @en-US Update node
 * @zh-CN 更新节点
 *
 * @param fields
 */

const handleUpdate = async (fields) => {
  const hide = message.loading('更新中');
  try {
    await updateSchema(fields);
    hide();
    message.success('更新成功');
    return true;
  } catch (error) {
    hide();
    message.error('更新失败， 请重试!');
    return false;
  }
};
/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */


const LowcodePageList = () => {
  const [modalVisible, handleModalVisible] = useState(false);
  const [newOrEdit, setNewOrEdit] = useState(0); // 0: close, 1: new, 2: edit

  const actionRef = useRef();
  const formRef = useRef();

  const handleRemove = async (id) => {
    const hide = message.loading('正在删除');
  
    try {
      await deletePage(id);
      hide();
      actionRef?.current?.reload();
      message.success('删除成功');
      return true;
    } catch (error) {
      hide();
      message.error('删除失败，稍后再试');
      return false;
    }
  };

  const renderRemoveUser = (text: string, id: number) => (
    <Popconfirm key="popconfirm" title={`确认${text}吗?`} okText="是" cancelText="否"  onConfirm={() => {
      handleRemove(id);
    }}>
      <a>{text}</a>
    </Popconfirm>
  );

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      valueType: 'number',
      width: "15%",
    },{
      title: '名称',
      dataIndex: 'name',
      tip: '页面名称',
      width: "60%",
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            setNewOrEdit(2);
            handleModalVisible(true);
            setTimeout(() => {
              formRef?.current?.setFieldsValue(record);
            }, 50);
          }}
        >
          编辑
        </a>,
        <Link to={`/lowcode/edit/${record.id}`}>
          页面配置
        </Link>,
        <a key="preview" href={`/preview/${record.id}`}>
          页面预览
        </a>,
        renderRemoveUser('删除', record.id),
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable
        headerTitle='低代码列表'
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalVisible(true);
              setNewOrEdit(1);
              setTimeout(() => {
                formRef.current?.setFieldsValue({
                  name: '',
                });
              }, 50);
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}
        request={getLowcodePageList}
        columns={columns}
      />
      {newOrEdit > 0 && (
      <ModalForm
        title={ newOrEdit === 1 ? '新建页面' : '编辑页面'}
        width="400px"
        visible={modalVisible}
        formRef={formRef}
        onVisibleChange={handleModalVisible}
        onCancel={() => {
          handleModalVisible(false);
          return true;
        }}
        onFinish={async (value) => {
          const success = await handleAdd(value);
          if (success) {
            handleModalVisible(false);
            actionRef?.current?.reload();
          }
        }}
      >

        <ProFormText
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.searchTable.ruleName"
                  defaultMessage="Rule name is required"
                />
              ),
            },
          ]}
          label="名称"
          width="md"
          name="name"
        />
        <ProFormTextArea width="md" name="desc" label="页面描述"/>
        <ProFormText
          width="xs"
          name="id"
          fieldProps= {{
            style: {
              display: 'none',
            },
          }}

        />
      </ModalForm>
    )}
    </PageContainer>
  );
};

export default LowcodePageList;
