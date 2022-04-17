import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Alert, Typography } from 'antd';
import { useIntl, FormattedMessage } from 'umi';
import styles from './Welcome.less';

const Welcome = () => {
  const intl = useIntl();
  return (
    <PageContainer>
      欢迎使用低代码平台
    </PageContainer>
  );
};

export default Welcome;
