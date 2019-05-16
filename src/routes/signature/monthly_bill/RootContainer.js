import React from 'react';
import { connect } from 'react-redux';
import {EnhanceLoading} from '../../../components/Enhance';
import createTabPage from '../../../standard-business/createTabPage';
import {getPathValue} from '../../../action-reducer/helper';
import {Action} from '../../../action-reducer/action';
import helper from '../../../common/common';
import {search} from '../../../common/search';
import {buildOrderPageState} from '../../../common/state';


import OrderPageContainer from './OrderPageContainer';
import LookBillContainer from './LookBillContainer'

const STATE_PATH = ['monthly_bill'];
const action = new Action(STATE_PATH);

const URL_LIST = '/api/signature/monthly_bill/list';
const URL_ROLE = '/api/signature/monthly_bill/role';
const URL_CONFIG = '/api/signature/monthly_bill/config';


const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const initActionCreator = () => async (dispatch, getState) => {
  try {
    const defaultTabs = [{key: 'index', title: '月账单', close: false}];
    const {activeKey='index', tabs=defaultTabs} = getSelfState(getState());
    dispatch(action.assign({status: 'loading'}));
    const json = helper.getJsonResult(await helper.fetchJson(URL_ROLE));
    console.log(json);
    //初始化数据
    const { index , edit } = helper.getJsonResult(await helper.fetchJson(URL_CONFIG));
    //页面数据
    const obj = {};
    if(json.contractRoles === "econtract_company_role"){
      obj.companyId = json.userId
    }
    const list = helper.getJsonResult(await search(URL_LIST, 0, index.pageSize, obj));
    const body = buildOrderPageState(list, index, {tabKey: 'index'});
    if(json.contractRoles === "econtract_company_role"){
     body.filters.splice(0,1)
    }
    dispatch(action.assign({
      status: 'page',
      index: body,
      activeKey,
      tabs,
      editConfig:edit
    }));

  }catch (e){
    helper.showError(e.message);
    dispatch(action.assign({status: 'retry'}));
  }
};


const tabChangeActionCreator = (key) => {
  return action.assign({activeKey: key});
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
  if (activeKey === 'index') {
    return OrderPageContainer;
  }else if(activeKey.indexOf('look_') === 0){
    return LookBillContainer;
  }
};



const RootContainer = connect(mapStateToProps, actionCreators)(EnhanceLoading(createTabPage(getComponent)));
export default RootContainer;
