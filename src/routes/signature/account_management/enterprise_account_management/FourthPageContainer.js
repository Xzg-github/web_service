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
import showLookDialog from './ShowDiaLog/LookDialogContainer';
import {search,search2} from '../../../../common/search';
import {toFormValue,hasSign} from '../../../../common/check';
import {buildOrderPageState} from '../../../../common/state';


const TAB_KEY = 'four';
const STATE_PATH =  ['enterprise_account_management'];

const URL_LIST = '/api/signature/account_management/enterprise_account_management/list';//获取列表信息
const URL_PRICE = '/api/signature/account_management/enterprise_account_management/price';//根据id获取价格信息
const URL_RECORD = '/api/signature/account_management/enterprise_account_management/record';//根据id获取账单信息

const action = new Action(STATE_PATH);

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH)[TAB_KEY];
};

const initActionCreator = () => async (dispatch, getState) => {
  dispatch(action.assign({status: 'loading'}, TAB_KEY));
  try {
    const state = getSelfState(getState());
    //页面数据
    const list = helper.getJsonResult(await search(URL_LIST, 0, 10, {}));
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
  const {order,pay} = getSelfState(getState());
  if (await showDiaLog(order,pay)) {
    return updateTable(dispatch, getState)
  }
};

const payAction = () => async (dispatch, getState) => {
  const {pay,tableItems} = getSelfState(getState());
  const index = helper.findOnlyCheckedIndex(tableItems);
  if(index === -1){
    helper.showError('请勾选一条记录');
    return
  }
  const id = tableItems[index].id;
  const {result,returnCode,returnMsg} = await helper.fetchJson(`${URL_PRICE}/${id}`);
  if(returnCode!==0){
    helper.showError(returnMsg);
    return
  }
  result.number = Math.floor(result.orderMoney/result.unitPrice);
  if (await showPayDiaLog(pay,[result],result.nativeOrderNo)) {
    return updateTable(dispatch, getState)
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


const lookActionCreator = () => async (dispatch, getState) => {
  const {look,tableItems} = getSelfState(getState());
  const index = helper.findOnlyCheckedIndex(tableItems);
  if(index === -1){
    helper.showError('请勾选一条记录');
    return
  }
  const id = tableItems[index].id;
  const {result,returnCode,returnMsg} = await helper.fetchJson(`${URL_RECORD}/${id}`);
  if(returnCode!==0){
    helper.showError(returnMsg);
    return
  }
  if (await showLookDialog(look,result)) {

  }
};



const toolbarActions = {
  order:orderAction,
  pay:payAction,
  input:inputAction,
  application:applicationAction,
  search: searchClickActionCreator,
  reset: resetActionCreator,
  look:lookActionCreator
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

const checkActionCreator = (isAll, checked, rowIndex) => {
  const index = isAll ? -1 : rowIndex;
  return action.update({checked}, [TAB_KEY,'tableItems'], index);
};



const actionCreators = {
  onClick: clickActionCreator,
  onChange: changeActionCreator,
  onInit: initActionCreator,
  onCheck: checkActionCreator,
  onPageNumberChange: pageNumberActionCreator,
  onPageSizeChange: pageSizeActionCreator,
  onExitValid: exitValidActionCreator,
};

const Container = connect(mapStateToProps, actionCreators)(EnhanceLoading(OrderPage));
export default Container;
