import React from 'react';
import PageContainer from './PageContainer';

export default {
  path: '/password/find',
  action() {
    return {
      wrap: true,
      title: '找回密码',
      component: <PageContainer />
    };
  }
};
