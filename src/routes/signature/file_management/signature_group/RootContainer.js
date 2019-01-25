import React from 'react';
import { connect } from 'react-redux';
import {EnhanceLoading} from '../../../../components/Enhance';
import createTabPage from '../../../../standard-business/createTabPage';
import {getPathValue} from '../../../../action-reducer/helper';
import {Action} from '../../../../action-reducer/action';
import helper from '../../../../common/common';
import {search} from '../../../../common/search';
import {buildOrderPageState} from '../../../../common/state';


import OrderPageContainer from './OrderPageContainer';
import EditContainer from './EditContainer'

const STATE_PATH = ['signature_group'];
const action = new Action(STATE_PATH);

const URL_LIST = '/api/signature/file_management/signature_group/list';
const URL_CONFIG = '/api/signature/file_management/signature_group/config';


const handleList = (data) => {
  for(let list of data){
    if(list.list){
      let arr = [];
      list.signGroupNumber = list.list.length;
      for(let item of list.list){
        arr.push(item.realName)
      }
      list.signGroupPeople = arr.join(';')
    }else {
      list.signGroupNumber = 0;
    }
  }
  return data
};

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const initActionCreator = () => async (dispatch, getState) => {
  try {
    const defaultTabs = [{key: 'index', title: '签署群组', close: false}];
    const {activeKey='index', tabs=defaultTabs} = getSelfState(getState());
    dispatch(action.assign({status: 'loading'}));
    //初始化数据
    const { index , edit } = helper.getJsonResult(await helper.fetchJson(URL_CONFIG));
    //页面数据
    let list = helper.getJsonResult(await search(URL_LIST, 0, index.pageSize, {}));
    list.data = handleList(list.data);


    dispatch(action.assign({
      status: 'page',
      index: buildOrderPageState(list, index, {tabKey: 'index'}),
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
  }else if(activeKey.indexOf('add_') === 0){
    return EditContainer;
  }else if(activeKey.indexOf('edit_') === 0){
    return EditContainer;
  }
};



const RootContainer = connect(mapStateToProps, actionCreators)(EnhanceLoading(createTabPage(getComponent)));
export default RootContainer;
export {handleList}
