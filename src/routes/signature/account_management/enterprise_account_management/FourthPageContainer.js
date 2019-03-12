import { connect } from 'react-redux';
import OrderPage from '../../../../components/OrderPage/OrderPage';
import {EnhanceLoading} from '../../../../components/Enhance';
import helper,{getObject, swapItems} from '../../../../common/common';
import {Action} from '../../../../action-reducer/action';
import {getPathValue} from '../../../../action-reducer/helper';
import showDiaLog from './ShowDiaLog/OrderContainer';
import showPayDiaLog from './ShowDiaLog/PayDialogContainer';
import showDiaLogOne from './ShowDiaLog/DialogContainer';
import showApplication from './ShowDiaLog/ApplicationDialogContainer';
import {search,search2} from '../../../../common/search';
import {toFormValue,hasSign} from '../../../../common/check';
import {buildOrderPageState} from '../../../../common/state';


const TAB_KEY = 'four';
const STATE_PATH =  ['enterprise_account_management'];

const URL_LIST = '/api/signature/account_management/enterprise_account_management/list';//获取列表信息

const action = new Action(STATE_PATH);

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH)[TAB_KEY];
};

const initActionCreator = () => async (dispatch, getState) => {
  const state = getSelfState(getState());
  //页面数据
  const list = helper.getJsonResult(await search(URL_LIST, 0, 10, {}));
  dispatch(action.assign({status: 'loading'}, TAB_KEY));
  try {
    dispatch(action.assign({
      ...state,
      tableItems:list.data,
      maxRecords: list.returnTotalItem,
      currentPage: 1,
      status: 'page',
    }, TAB_KEY));

  } catch (e) {
    helper.showError(e.message);
    dispatch(action.assign({status: 'retry'}, TAB_KEY));
  }
};

//刷新表格
const updateTable = async (dispatch, getState) => {
  const {currentPage, pageSize, searchDataBak={}} = getSelfState(getState());
  return search2(dispatch, action, URL_LIST, currentPage, pageSize, toFormValue(searchDataBak),{},TAB_KEY);
};

const resetActionCreator  = () =>(dispatch,getState) =>{
  dispatch( action.assign({searchData: {}},TAB_KEY) );
};

const searchClickActionCreator = () => async (dispatch, getState) => {
  const {pageSize, searchData} = getSelfState(getState());
  const newState = {searchDataBak: searchData, currentPage: 1};
  return search2(dispatch, action, URL_LIST, 1, pageSize, toFormValue(searchData), newState,TAB_KEY);
};


const orderAction = () => async (dispatch, getState) => {
  const {order} = getSelfState(getState());

  if (await showDiaLog(order,[])) {

  }
};

const payAction = () => async (dispatch, getState) => {
  const {pay} = getSelfState(getState());

  if (await showPayDiaLog(pay,[],'1231233')) {

  }
};


const inputAction = () => async (dispatch, getState) => {
  const {input} = getSelfState(getState());
  if (await showDiaLogOne(input,{})) {

  }
};

const applicationAction = () => async (dispatch, getState) => {
  const {application} = getSelfState(getState());
  if (await showApplication(application,{a:'1'})) {

  }
};


const toolbarActions = {
  order:orderAction,
  pay:payAction,
  input:inputAction,
  application:applicationAction,
  search: searchClickActionCreator,
  reset: resetActionCreator,
};

const clickActionCreator = (key) => {
  if (toolbarActions.hasOwnProperty(key)) {
    return toolbarActions[key]();
  } else {
    return {type: 'unknown'};
  }
};

const changeActionCreator = (key, value) => (dispatch,getState) =>{
  dispatch(action.assign({[key]: value}, [TAB_KEY,'searchData']));
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};


const exitValidActionCreator = () => {
  return action.assign({valid: false},TAB_KEY);
};

const pageNumberActionCreator = (currentPage) => (dispatch, getState) => {
  const {pageSize, searchDataBak={}} = getSelfState(getState());
  const newState = {currentPage};
  return search2(dispatch, action, URL_LIST, currentPage, pageSize, toFormValue(searchDataBak), newState,TAB_KEY);
};

const pageSizeActionCreator = (pageSize, currentPage) => async (dispatch, getState) => {
  const {searchDataBak={}} = getSelfState(getState());
  const newState = {pageSize, currentPage};
  return search2(dispatch, action, URL_LIST, currentPage, pageSize, toFormValue(searchDataBak), newState,TAB_KEY);
};


const actionCreators = {
  onClick: clickActionCreator,
  onChange: changeActionCreator,
  onInit: initActionCreator,
  onPageNumberChange: pageNumberActionCreator,
  onPageSizeChange: pageSizeActionCreator,
  onExitValid: exitValidActionCreator,
};

const Container = connect(mapStateToProps, actionCreators)(EnhanceLoading(OrderPage));
export default Container;
