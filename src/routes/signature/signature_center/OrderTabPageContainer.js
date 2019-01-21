import { connect } from 'react-redux';
import { Action } from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {search2} from '../../../common/search';
import helper from '../../../common/common';
import { getObject } from '../../../common/common';
import createOrderTabPageContainer, {buildOrderTabPageCommonState, updateTable} from "../../../standard-business/OrderTabPage/createOrderTabPageContainer";
import ShowPageContainer,{buildShowState} from "./ShowPageContainer/ShowPageContainer";
import showPopup from '../../../standard-business/showPopup';

const STATE_PATH = ['signature_center'];
const action = new Action(STATE_PATH);
const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const buildOrderTabPageState = async () => {
  const urlConfig = '/api/signature/signature_center/config';
  const urlList = '/api/signature/signature_center/list';
  const statusNames = ['order_type'];
  return buildOrderTabPageCommonState(urlConfig, urlList, statusNames)
};

//构建新增编辑页面状态
const showOrderInfoPage = (dispatch, item, selfState, edit) => {
  const key = item.id ? item.id : 'add ';
  const title = edit? item.associatedFileTheme : '新增';
  if(helper.isTabExist(selfState.tabs,key)){
    dispatch(action.assign({activeKey: key}))
  }else{
    const closeFunc = () => {
      const newTabs = selfState.tabs.filter(tab => tab.key !== key);
      dispatch(action.assign({tabs: newTabs, [key]: undefined, activeKey: 'index'}));
      return updateTable(dispatch, action, selfState, ['mySign']);
    };
    const payload = {
      id: item.id,
      closeFunc
    };
    dispatch(action.add({key, title}, 'tabs'));
    dispatch(action.assign({[key]: payload, activeKey: key}));
  }
};

// 搜索值变化
const onChangeActionCreator = (key, value) => async (dispatch) => {
  dispatch(action.assign({ [key]: value }, 'searchData'));
};

//搜索
const searchAction = async (dispatch, getState) => {
  const {pageSize, searchData} = getSelfState(getState());
  const newState = {searchDataBak: searchData, currentPage: 1};
  return search2(dispatch, action, URL_LIST, 1, pageSize, searchData, newState);
};

// 重置
const resetActionCreator = (dispatch, getState) => {
  dispatch(action.assign({ searchData: {} }));
};

//新增
const addAction  = (tabKey) => async (dispatch, getState) => {
  const selfState = getSelfState(getState());
  showOrderInfoPage(dispatch, {}, selfState, false)
};

//编辑
const editAction = (tabKey) => async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const checkedItems = tableItems[tabKey].filter(item => item.checked === true);
  if(checkedItems.length !== 1)return helper.showError('请勾选一条记录');
  return showOrderInfoPage(dispatch, checkedItems[0], getSelfState(getState()), true)
};

//删除
const delAction = (tabKey) => async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  return updateTable(dispatch, action, getSelfState(getState()));
};

// link详情查看
const onLinkActionCreator = (tabKey, key, rowIndex, item) => (dispatch, getState) => {
  const {showConfig, tableItems} = getSelfState(getState());
  const items = tableItems[tabKey][rowIndex];
  const title = items.associatedFileTheme;
  buildShowState(showConfig, items, dispatch, title);
  showPopup(ShowPageContainer);
};

//下载模板
const uploadActionCreator = (tabKey) => async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const checkedItems = tableItems[tabKey].filter(item => item.checked === true);
  if(checkedItems.length !== 1)return helper.showError('请勾选一条记录');
  const URL_DOWNLOAD= '/api/track/file_manager/download';  // 点击下载
  const {returnCode, result, returnMsg} = await helper.fetchJson(`${URL_DOWNLOAD}/${checkedItems.url}`);
    if (returnCode !== 0) {
      return helper.showError(returnMsg);
    }
    helper.download(`/api/proxy/zuul/file-center-service/${result[checkedItems.url]}`,'file');
};


const toolbarActions = {
  search: searchAction,
  reset: resetActionCreator,
  add: addAction,
  edit: editAction,
  del: delAction,
  upload: uploadActionCreator
};

const clickActionCreator = (tabKey, key) => {
  if (toolbarActions[key]) {
    return toolbarActions[key](tabKey);
  } else {
    console.log('unknown key:', key);
    return {type: 'unknown'};
  }
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onClick: clickActionCreator,
  onChange: onChangeActionCreator,
  onLink: onLinkActionCreator
};

export default createOrderTabPageContainer(action, getSelfState, actionCreators);
export {buildOrderTabPageState};
