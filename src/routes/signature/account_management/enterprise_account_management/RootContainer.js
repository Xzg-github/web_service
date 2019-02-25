/*
* 根目录
* */

import React from 'react';
import { connect } from 'react-redux';
import {EnhanceLoading} from '../../../../components/Enhance';
import createTabPage from '../../../../standard-business/createTabPage';
import {getPathValue} from '../../../../action-reducer/helper';
import {Action} from '../../../../action-reducer/action';
import helper from '../../../../common/common';


import FirstPageContainer from './FirstPageContainer';
import SecondPageContainer from './SecondPageContainer';
import ThirdPageContainer from './ThirdPageContainer';
import FourthPageContainer from './FourthPageContainer';


const STATE_PATH = ['enterprise_account_management'];
const action = new Action(STATE_PATH);

const URL_LIST = '/api/signature/account_management/enterprise_account_management/list';
const URL_CONFIG = '/api/signature/account_management/enterprise_account_management/config';


const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const initActionCreator = () => async (dispatch, getState) => {
  try {
    dispatch(action.assign({status: 'loading'}));
    //初始化数据
    const { tabs,one,two,three,four } = helper.getJsonResult(await helper.fetchJson(URL_CONFIG));

    //页面数据
    dispatch(action.assign({
      status: 'page',
      activeKey:'one',
      tabs,
      one,
      two,
      three,
      four
    }));

  }catch (e){
    helper.showError(e.message);
    dispatch(action.assign({status: 'retry'}));
  }
};


const tabChangeActionCreator = (key) => (dispatch, getState) => {
  dispatch(action.assign({activeKey: key}));
};


const actionCreators = {
  onInit: initActionCreator,
  onTabChange: tabChangeActionCreator,
};


const mapStateToProps = (state) => {
  return getSelfState(state)
};

const getComponent = (activeKey) => {
  if (activeKey === 'one') {
    return FirstPageContainer;
  }else if(activeKey === 'two'){
    return SecondPageContainer;
  }else if(activeKey === 'three'){
    return ThirdPageContainer
  }else if(activeKey === 'four'){
    return FourthPageContainer
  }

};



const RootContainer = connect(mapStateToProps, actionCreators)(EnhanceLoading(createTabPage(getComponent)));
export default RootContainer;
