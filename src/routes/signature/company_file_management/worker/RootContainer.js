import {connect} from 'react-redux';
import OrderPage from '../../../../components/OrderPage';
import {EnhanceLoading} from '../../../../components/Enhance';
import {Action} from '../../../../action-reducer/action';
import helper, {showError} from '../../../../common/common';
import {buildOrderPageState} from '../../../../common/state';
import {search, search2} from '../../../../common/search';
import showDialog from './EdiltDialogContainer';
import {toFormValue} from "../../../../common/check";


const action = new Action(['worker'], false);
const URL_CONFIG = '/api/signature/company_file_management/worker/config';
const URL_LIST = '/api/signature/company_file_management/worker/list';
const URL_STATUS = '/api/signature/company_file_management/worker/status';

const getSelfState = (state) => {
  return state.worker || {};
};

const initActionCreator = () => async (dispatch) => {
  try {
    dispatch(action.assign({status: 'loading'}));
    const config = helper.getJsonResult(await helper.fetchJson(URL_CONFIG));
    const list = helper.getJsonResult(await search(URL_LIST, 0, config.pageSize, {}));
    const payload = buildOrderPageState(list, config.index, config.edit);
    payload.status = 'page';
    payload.searchDataBak = payload.searchData;
    dispatch(action.assign(payload));
  } catch (e) {
    helper.showError(e.message);
    dispatch(action.assign({status: 'retry'}));
  }
};

const refresh = (dispatch, state) => {
  return search2(dispatch, action, URL_LIST, state.currentPage, state.pageSize, state.searchDataBak);
};

const changeActionCreator = (key, value) => {
  return action.assign({[key]: value}, 'searchData');
};

const resetActionCreator = () => {
  return action.assign({searchData: {}});
};

const searchActionCreator = () => async (dispatch, getState) => {
  const {pageSize, searchData} = getSelfState(getState());
  const newState = {searchDataBak: searchData, currentPage: 1};
  return search2(dispatch, action, URL_LIST, 1, pageSize, searchData, newState);
};

const pageNumberActionCreator = (currentPage) => (dispatch, getState) => {
  const {pageSize, searchDataBak={}} = getSelfState(getState());
  const newState = {currentPage};
  return search2(dispatch, action, URL_LIST, currentPage, pageSize, searchDataBak, newState);
};

const pageSizeActionCreator = (pageSize, currentPage) => async (dispatch, getState) => {
  const {searchDataBak={}} = getSelfState(getState());
  const newState = {pageSize, currentPage};
  return search2(dispatch, action, URL_LIST, currentPage, pageSize, searchDataBak, newState);
};

/*//新增
const addActionCreator = () => async (dispatch, getState) => {
  const { editConfig } = getSelfState(getState());
  if (await showDialog(editConfig, {} ,false)) {
    refresh(dispatch, state);
  }
};

//编辑
const editActionCreator = () => async (dispatch, getState) => {
  const { editConfig , tableItems } = getSelfState(getState());
  const items = tableItems.filter(item => item.checked);
  if (items.length !== 1) {
    helper.showError('请勾选一条记录');
  }else if (await showDialog(editConfig, items[0] ,true)) {
    refresh(dispatch, state);
  }
};*/

//审核
const examineActionCreator = ()=> async(dispatch, getState) => {
  const { tableItems, config } = getSelfState(getState());
  const items = tableItems.filter(item => item.checked);
  if(items.length !== 1){
    helper.showError('请勾选一条记录');
    return
  }
  if (await showDialog( items[0] ,config)) {
    refresh(dispatch, state);
  }
};

//刷新表格
const updateTable = async (dispatch, getState) => {
  const {currentPage, pageSize, searchDataBak={}} = getSelfState(getState());
  return search2(dispatch, action, URL_LIST, currentPage, pageSize, toFormValue(searchDataBak));
};

//启用
const enableActionCreator = () => async(dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const items = tableItems.filter(item => item.checked);
  if(items.length === 0){
    showError('请勾选一条记录');
    return
  }
  const id = items[0].id;
  const {returnCode,returnMsg} = await helper.fetchJson(URL_STATUS, helper.postOption({id, userAccountState: '4'}, 'post'));
  if(returnCode === 0){
    helper.showSuccessMsg('启用成功');
    return updateTable(dispatch, getState)
  }else{
    showError(returnMsg)
  }
};

//禁用
const disableActionCreator = () => async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const items = tableItems.filter(item => item.checked);
  if(items.length === 0){
    showError('请勾选一条记录');
    return
  }
  const id = items[0].id;
  const {returnCode,returnMsg} = await helper.fetchJson(URL_STATUS, helper.postOption({id, userAccountState: '0'}, 'post'));
  if(returnCode === 0){
    helper.showSuccessMsg('禁用成功');
    return updateTable(dispatch, getState)
  }else{
    showError(returnMsg)
  }
};


const clickActionCreators = {
  reset: resetActionCreator,
  search: searchActionCreator,
  examine: examineActionCreator,
  disable: disableActionCreator,
  enable: enableActionCreator
};

const clickActionCreator = (key) => {
  if (clickActionCreators.hasOwnProperty(key)) {
    return clickActionCreators[key]();
  } else {
    return {type: 'unknown'};
  }
};

const checkActionCreator = (isAll, checked, rowIndex) => {
  isAll && (rowIndex = -1);
  return action.update({checked}, 'tableItems', rowIndex);
};

const doubleClickActionCreator = (rowIndex) => (dispatch, getState) => {
  const state = getSelfState(getState());
};


const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onInit: initActionCreator,
  onChange: changeActionCreator,
  onClick: clickActionCreator,
  onCheck: checkActionCreator,
  onDoubleClick: doubleClickActionCreator,
  onPageNumberChange: pageNumberActionCreator,
  onPageSizeChange: pageSizeActionCreator
};

export default connect(mapStateToProps, actionCreators)(EnhanceLoading(OrderPage));
