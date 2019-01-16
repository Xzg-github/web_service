import React from 'react';
//import Registered from './Registered';

export default {
  path: '/registered',
  action() {
    return {
      wrap: true,
      title: '注册',
      component: <div>123</div>
    };
  }
};
