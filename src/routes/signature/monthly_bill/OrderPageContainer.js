import { connect } from 'react-redux';
import OrderPage from '../../../components/OrderPage';
import helper,{getObject, swapItems} from '../../../common/common';
import {toFormValue,hasSign} from '../../../common/check';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {search2} from '../../../common/search';
import { exportExcelFunc, commonExport } from '../../../common/exportExcelSetting';

const TAB_KEY = 'index';
const STATE_PATH =  ['monthly_bill'];

const URL_LIST = '/api/signature/monthly_bill/list';

const action = new Action(STATE_PATH);

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH)[TAB_KEY];
};

// 页面的初始状态
const buildPageState = (tabs, tabKey, title,value={}) => {
  const {id} = value;
  return {
    activeKey: tabKey,
    tabs: tabs.concat({key: tabKey, title: title}),
    [tabKey]: {tabKey,id,updateTable},
  };
};


//刷新表格
const updateTable = async (dispatch, getState) => {
  const {currentPage, pageSize, searchDataBak={},tabKey} = getSelfState(getState());
  return search2(dispatch, action, URL_LIST, currentPage, pageSize, toFormValue(searchDataBak),{},tabKey);
};

const resetActionCreator = (dispatch,getState) =>{
  const {tabKey} = getSelfState(getState());
  dispatch( action.assign({searchData: {}},tabKey) );
};

const searchClickActionCreator = async (dispatch, getState) => {
  const {pageSize, searchData,tabKey} = getSelfState(getState());
  const newState = {searchDataBak: searchData, currentPage: 1};
  return search2(dispatch, action, URL_LIST, 1, pageSize, toFormValue(searchData), newState,tabKey);
};



const toolbarActions = {
  search: searchClickActionCreator,
  reset: resetActionCreator,};

const clickActionCreator = (key) => {
  if (toolbarActions.hasOwnProperty(key)) {
    return toolbarActions[key];
  } else {
    console.log('unknown key:', key);
    return {type: 'unknown'};
  }
};

const onLinkActionCreator = (key, rowIndex, item)  => async (dispatch,getState) => {
  const {tabs} = getPathValue(getState(), STATE_PATH);
  const tabKey = helper.genTabKey('look', tabs);
  const title =  item.monthBillCode + '-查看月账单';
  dispatch(action.assign(buildPageState (tabs, tabKey,title,item)));
};

const changeActionCreator = (key, value) => (dispatch,getState) =>{
  const {tabKey} = getSelfState(getState());
  dispatch(action.assign({[key]: value}, [tabKey,'searchData']));
};

const formSearchActionCreator = (key, title,keyControl) => async (dispatch, getState) => {
  const {filters,tabKey} = getSelfState(getState());
  const json = await helper.fuzzySearchEx(title,keyControl);
  if (!json.returnCode) {
    const index = filters.findIndex(item => item.key == key);
    dispatch(action.update({options:json.result}, [tabKey,'filters'], index));
  }else {
    helper.showError(json.returnMsg)
  }
};
const checkActionCreator = (isAll, checked, rowIndex) =>  (dispatch, getState) =>{
  const {tabKey} = getSelfState(getState());
  isAll && (rowIndex = -1);
  dispatch(action.update({checked}, [tabKey,'tableItems'], rowIndex));
};

const swapActionCreator = (key1, key2) => (dispatch) => {
  const {tableCols} = getSelfState(getState());
  dispatch(action.assign({tableCols: swapItems(tableCols, key1, key2)}));
};


const pageNumberActionCreator = (currentPage) => (dispatch, getState) => {
  const {pageSize, searchDataBak={},tabKey} = getSelfState(getState());
  const newState = {currentPage};
  return search2(dispatch, action, URL_LIST, currentPage, pageSize, toFormValue(searchDataBak), newState,tabKey);
};

const pageSizeActionCreator = (pageSize, currentPage) => async (dispatch, getState) => {
  const {searchDataBak={},tabKey} = getSelfState(getState());
  const newState = {pageSize, currentPage};
  return search2(dispatch, action, URL_LIST, currentPage, pageSize, toFormValue(searchDataBak), newState,tabKey);
};


const mapStateToProps = (state) => {
  return getObject(getSelfState(state), OrderPage.PROPS);
};

const actionCreators = {
  onClick: clickActionCreator,
  onChange: changeActionCreator,
  onCheck: checkActionCreator,
  onSwapCol: swapActionCreator,
  onPageNumberChange: pageNumberActionCreator,
  onPageSizeChange: pageSizeActionCreator,
  onSearch: formSearchActionCreator,
  onLink: onLinkActionCreator,
};

const Container = connect(mapStateToProps, actionCreators)(OrderPage);
export default Container;
export {updateTable};
