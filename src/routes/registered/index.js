import React from 'react';
import Registered from './Registered';

export default {
  path: '/registered',
  action() {
    return {
      wrap: true,
      title: '注册账号',
      component: <Registered />
    };
  }
};
