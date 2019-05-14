import { connect } from 'react-redux';
import OrderPage from '../../../../components/OrderPage';
import {Action} from '../../../../action-reducer/action';
import {getPathValue} from '../../../../action-reducer/helper';
import {commonExport, exportExcelFunc} from "../../../../common/exportExcelSetting";
import helper, {getObject, fetchJson, showError} from '../../../../common/common';
import {search2} from '../../../../common/search';

const STATE_PATH = ['enterpriseBusinessFlow'];
const action = new Action(STATE_PATH);

const urlItemName = '/api/signature/dataStatistics/enterpriseBusinessFlow/itemName';
const urlList =  '/api/signature/dataStatistics/enterpriseBusinessFlow/list';

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

// 搜索
const searchActionCreator = async (dispatch, getState) => {
  const {pageSize, searchData, userId} = getSelfState(getState());
  const filter = Object.assign({}, searchData, {companyId: userId});
  const newState = {searchDataBak: searchData, currentPage: 1};
  return search2(dispatch, action, urlList, 1, pageSize, filter, newState);
};

// 清空搜索框
const resetActionCreator = () => {
  return action.assign({searchData: {}});
};

// 查询导出
const exportSearchActionCreator = (dispatch, getState) => {
  const {tableCols, searchData, userId} = getSelfState(getState());
  const filter = Object.assign({}, searchData, {companyId: userId});
  return commonExport(tableCols, '/fadada-service/data_statics/order_detail_serial', filter);
};

// 页面导出
const exportPageActionCreator = async (dispatch, getState) => {
  const {tableCols, tableItems} = getSelfState(getState());
  return exportExcelFunc(tableCols, tableItems);
};

const toolbarActions = {
  reset: resetActionCreator(),
  search: searchActionCreator,
  exportSearch: exportSearchActionCreator,
  exportPage: exportPageActionCreator,
};

const clickActionCreator = (key) => {
  if (toolbarActions.hasOwnProperty(key)){
    return toolbarActions[key];
  } else {
    console.log('unknow key:', key);
    return {type: 'unknown'};
  }
};

const changeActionCreator = (key, value) => action.assign({[key]: value}, 'searchData');

const checkActionCreator = (isAll, checked, rowIndex) => {
  isAll && (rowIndex = -1);
  return action.update({checked}, 'tableItems', rowIndex);
};

const pageNumberActionCreator = (currentPage) => (dispatch, getState) => {
  const {pageSize, searchDataBak={}, userId} = getSelfState(getState());
  const filter = Object.assign({}, searchDataBak, {companyId: userId});
  const newState = {currentPage};
  return search2(dispatch, action, urlList, currentPage, pageSize, filter, newState);
};

const pageSizeActionCreator = (pageSize, currentPage) => async (dispatch, getState) => {
  const {searchDataBak={}, userId} = getSelfState(getState());
  const filter = Object.assign({}, searchDataBak, {companyId: userId});
  const newState = {pageSize, currentPage};
  return search2(dispatch, action, urlList, currentPage, pageSize, filter, newState);
};

const filterSearchActionCreator = (key, value) => async (dispatch)=> {
  if(key === 'businessCode'){
    const option = helper.postOption({itemName: value, "maxNumber": 10});
    const {result, returnCode, returnMsg} = await fetchJson(urlItemName, option);
    returnCode === 0
      ? dispatch(action.update({options: result},'filters',{key: 'key', value: key}))
      : showError(returnMsg);
  }
};

const actionCreators = {
  onSearch:filterSearchActionCreator,
  onClick: clickActionCreator,
  onChange: changeActionCreator,
  onCheck: checkActionCreator,
  onPageNumberChange: pageNumberActionCreator,
  onPageSizeChange: pageSizeActionCreator
};

const mapStateToProps = (state) => {
  return getObject(getSelfState(state), OrderPage.PROPS);
};

export default connect(mapStateToProps, actionCreators)(OrderPage);
