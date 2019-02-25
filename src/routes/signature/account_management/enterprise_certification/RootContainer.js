/*
* 根目录
* 第一步和第二步共用一个value
*
*
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
import ForuthPageContainer from './ForuthPageContainer';


const STATE_PATH = ['enterprise_certification'];
const action = new Action(STATE_PATH);

const URL_LIST = '/api/signature/account_management/enterprise_certification/list';
const URL_CONFIG = '/api/signature/account_management/enterprise_certification/config';


const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const initActionCreator = () => async (dispatch, getState) => {
  try {
    const defaultTabs = [
      {key: 'one', title: '1.填写企业信息', close: false},
      {key: 'two', title: '1.填写企业信息', close: false},
      {key: 'three', title: '1.填写企业信息', close: false},
      {key: 'four', title: '1.填写企业信息', close: false},
      ];
    dispatch(action.assign({status: 'loading'}));
    //初始化数据
    const { one ,two } = helper.getJsonResult(await helper.fetchJson(URL_CONFIG));

    //页面数据
    dispatch(action.assign({
      status: 'page',
      one:{tabKey:'one',...one},
      two,
      three:{},
      four:{},
      activeKey:'one',
      tabs:defaultTabs,
    }));

  }catch (e){
    helper.showError(e.message);
    dispatch(action.assign({status: 'retry'}));
  }
};


const tabChangeActionCreator = (key) => (dispatch, getState) => {
  const {activeKey,tabs} = getSelfState(getState());
  const state = getSelfState(getState());
  if((key === 'one' || key === 'two') && (activeKey === 'one' || activeKey === 'two') && tabs.length < 3){
    //校验必填
    const value = state[activeKey].value;

    if(activeKey === 'one'){

      const controls = [...state[activeKey].controlsLeft,...state[activeKey].controlsRight];
      if (!helper.validValue(controls,value)) {
        dispatch(action.assign({valid: true},activeKey));
        return
      }


      for(let box of state[activeKey].uploadBox){
        if(!value[box.key]){
          return helper.showError(`${box.title}不能为空`)
        }
      }


    }



    dispatch(action.assign({value},key));
  }
  dispatch(action.assign({activeKey: key}));
};

const tabCloseActionCreator = (key) => (dispatch, getState) => {
  const {activeKey, tabs} = getSelfState(getState());
  const newTabs = tabs.filter(tab => tab.key !== key);
  if (activeKey === key) {
    let index = tabs.findIndex(tab => tab.key === key);
    (newTabs.length === index) && (index--);
    dispatch(action.assign({tabs: newTabs, [activeKey]: undefined, activeKey: newTabs[index].key}));
  } else {
    dispatch(action.assign({tabs: newTabs, [key]: undefined}));
  }
};



const actionCreators = {
  onInit: initActionCreator,
  onTabChange: tabChangeActionCreator,
  onTabClose: tabCloseActionCreator
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
    return ForuthPageContainer
  }

};



const RootContainer = connect(mapStateToProps, actionCreators)(EnhanceLoading(createTabPage(getComponent)));
export default RootContainer;
