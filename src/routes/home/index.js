import React from 'react';
import HomeContainer from './HomeContainer';
import LayoutContainer from '../../components/Layout/LayoutContainer';

const title = '工作台';

export default {
  path: '/',

  async action() {
    return {
      title,
        component: <LayoutContainer><h5>待开发</h5></LayoutContainer>
    };
  }
};
