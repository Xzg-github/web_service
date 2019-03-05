import React from 'react';
import { connect } from 'react-redux';
import {EnhanceLoading} from '../../../../components/Enhance';
import {createCommonTabPage} from '../../../../standard-business/createTabPage';
import {getPathValue} from '../../../../action-reducer/helper';
import {Action} from '../../../../action-reducer/action';
import helper from '../../../../common/common';
import {search} from '../../../../common/search';
import {buildOrderPageState} from '../../../../common/state';
import OrderPageContainer from './OrderPageContainer';
import EditPageContainer from './EditPageContainer';

const STATE_PATH = ['personalProfile'];
const action = new Action(STATE_PATH);

const URL_LIST = '/api/signature/file_management/personalProfile/list';
const URL_CONFIG = '/api/signature/file_management/personalProfile/config';

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const initActionCreator = () => async (dispatch, getState) => {
  try {
    dispatch(action.assign({status: 'loading'}));
    //初始化数据
    const { index, editConfig, tabs, activeKey } = helper.getJsonResult(await helper.fetchJson(URL_CONFIG));
    //页面数据
    const list = helper.getJsonResult(await search(URL_LIST, 0, index.pageSize, {}));

    const newState = {tabs, editConfig, activeKey, status: 'page'};
    const payload = buildOrderPageState(list, index, newState);

    dispatch(action.create(payload));
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

const UIComponent = EnhanceLoading(createCommonTabPage(OrderPageContainer, EditPageContainer));

export default connect(mapStateToProps, actionCreators)(UIComponent);

