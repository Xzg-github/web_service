import React from 'react';
import RootContainer from './RootContainer';


export default {
  path: '/fadada',
  action() {
    return {
      wrap: true,
      component: <RootContainer/>
    };
  }
};
