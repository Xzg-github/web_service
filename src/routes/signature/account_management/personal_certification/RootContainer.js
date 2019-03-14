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
import ThirdPageContainer from './ThirdPageContainer';

export const getCookie = (cookieName) =>{
  let strCookie = document.cookie;
  let arrCookie = strCookie.split("; ");
  for(let i = 0; i < arrCookie.length; i++){
    let arr = arrCookie[i].split("=");
    if(cookieName == arr[0]){
      return arr[1];
    }
  }
  return "";
}


const STATE_PATH = ['personal_certification'];
const action = new Action(STATE_PATH);

const URL_LIST = '/api/signature/account_management/personal_certification/list';
const URL_CONFIG = '/api/signature/account_management/personal_certification/config';

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const initActionCreator = () => async (dispatch, getState) => {
  try {
    dispatch(action.assign({status: 'loading'}));
    //初始化数据
    const { tabs ,three} = helper.getJsonResult(await helper.fetchJson(URL_CONFIG));

    let strCookie =  getCookie('token');
    //页面数据
    dispatch(action.assign({
      status: 'page',
      activeKey:'one',
      one:{strCookie},
      tabs,
      three
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
    return null;
  }else if(activeKey === 'three'){
    return ThirdPageContainer
  }else if(activeKey === 'four'){
    return null
  }

};



const RootContainer = connect(mapStateToProps, actionCreators)(EnhanceLoading(createTabPage(getComponent)));
export default RootContainer;
