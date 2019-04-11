import { connect } from 'react-redux';
import OrderPage from '../../../../components/OrderPage/OrderPage';
import {EnhanceLoading} from '../../../../components/Enhance';
import helper,{getObject, swapItems} from '../../../../common/common';
import {Action} from '../../../../action-reducer/action';
import {getPathValue} from '../../../../action-reducer/helper';
import showDiaLog from './ShowDiaLog/AddDialogContainer';
import execWithLoading from '../../../../standard-business/execWithLoading';
import {search,search2} from '../../../../common/search';
import {toFormValue,hasSign} from '../../../../common/check';

const TAB_KEY = 'three';
const STATE_PATH =  ['enterprise_account_management'];
const URL_SIGN = '/api/signature/account_management/personal_account_management/sign';//签章列表
const URL_LIST = '/api/signature/account_management/enterprise_account_management/listAuthl';//获取列表信息
const URL_DEL = '/api/signature/account_management/enterprise_account_management/delAuthl';//删除
const URL_BATCH = '/api/signature/account_management/enterprise_account_management/batchAuthl';//启用禁用
const URL_EDIT = '/api/signature/account_management/enterprise_account_management/edit';//获取单条信息

const action = new Action(STATE_PATH);

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH)[TAB_KEY];
};

//刷新表格
const updateTable = async (dispatch, getState) => {
  const {currentPage, pageSize, searchDataBak={},tabKey} = getSelfState(getState());
  return search2(dispatch, action, URL_LIST, currentPage, pageSize, toFormValue(searchDataBak),{},TAB_KEY);
};


const initActionCreator = () => async (dispatch, getState) => {
  const state = getSelfState(getState());
  dispatch(action.assign({status: 'loading'}, TAB_KEY));
  try {
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

const findCheckedIndex1 = (items) => {
  const index = items.reduce((result = [], item, index) => {
    item.checked && result.push(index);
    return result;
  }, []);
  return !index.length ? -1 : index;
};


const addAction = () => async (dispatch, getState) => {
  const {controls} = getSelfState(getState());
  let options = [];
  // execWithLoading(async () => {
  const {result,returnCode,returnMsg} = await helper.fetchJson(URL_SIGN);
  if(returnCode !=0){
    helper.showError(returnMsg);
    return
  }
  for(let item of result){
    options.push(
      {
        title:item.signSealName,
        value:item.id,
        imgBase:item.signSealImgBase64
      }
    )
  }
  //});
  controls[2].options = options;
  if (await showDiaLog(controls,{},'新增',false)) {
    return updateTable(dispatch, getState)
  }
};

const editAction = () => async (dispatch, getState) => {
  const {tableItems,controls} = getSelfState(getState());
  const index = helper.findOnlyCheckedIndex(tableItems);
  if(index === -1){
    helper.showError('请勾选一条记录');
    return
  }
  const id = tableItems[index].id;
  const authStatus = tableItems[index].authStatus;
  if(authStatus == 0){
    helper.showError('禁用不能编辑');
    return
  }
  const {result,returnCode,returnMsg} = await helper.fetchJson(`${URL_EDIT}/${id}`);
  if(returnCode!==0){
    helper.showError(returnMsg);
    return
  }

  let options = [];
  // execWithLoading(async () => {
  const json = await helper.fetchJson(URL_SIGN);
  if(json.returnCode !=0){
    helper.showError(json.returnMsg);
    return
  }
  for(let item of json.result){
    options.push(
      {
        title:item.signSealName,
        value:item.id,
        imgBase:item.signSealImgBase64
      }
    )
  }
  //});
  controls[2].options = options;
  if (await showDiaLog(controls,result,'编辑',true)) {
    return updateTable(dispatch, getState)
  }
};


const delAction = () => async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const index = findCheckedIndex1(tableItems);
  if (index === -1) {
    helper.showError('请勾选一条记录进行删除');
    return;
  }
  let item = [];
  index.forEach(index => {
    item.push(tableItems[index].id)
  });
  const {result,returnCode,returnMsg} = await helper.fetchJson(`${URL_DEL}`,helper.postOption(item,'delete'));
  if(returnCode !== 0 ){
    helper.showError(returnMsg);
    return
  }
  helper.showSuccessMsg(returnMsg);
  updateTable(dispatch, getState)

};

const enableAction = () => async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const index = findCheckedIndex1(tableItems);
  if (index === -1) {
    helper.showError('请勾选一条记录进行启用');
    return;
  }
  let item = [];
  index.forEach(index => {
    item.push(tableItems[index].id)
  });
  const {result,returnCode,returnMsg} = await helper.fetchJson(`${URL_BATCH}/1`,helper.postOption(item,'put'));
  if(returnCode !== 0 ){
    helper.showError(returnMsg);
    return
  }
  helper.showSuccessMsg(returnMsg);
  updateTable(dispatch, getState)

};

const disableAction = () => async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const index = findCheckedIndex1(tableItems);
  if (index === -1) {
    helper.showError('请勾选一条记录进行禁用');
    return;
  }
  let item = [];
  index.forEach(index => {
    item.push(tableItems[index].id)
  });
  const {result,returnCode,returnMsg} = await helper.fetchJson(`${URL_BATCH}/0`,helper.postOption(item,'put'));
  if(returnCode !== 0 ){
    helper.showError(returnMsg);
    return
  }
  helper.showSuccessMsg(returnMsg);
  return updateTable(dispatch, getState)

};

const toolbarActions = {
  add:addAction,
  edit:editAction,
  del:delAction,
  enable:enableAction,
  disable:disableAction
};

const clickActionCreator = (key) => {
  if (toolbarActions.hasOwnProperty(key)) {
    return toolbarActions[key]();
  } else {
    return {type: 'unknown'};
  }
};

const changeActionCreator = (key, value) => (dispatch,getState) =>{
  dispatch(action.assign({[key]: value}, [TAB_KEY,'value']));
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

const doubleClickActionCreator = (index) => async (dispatch, getState) => {
  const {tableItems,controls} = getSelfState(getState());
  const id = tableItems[index].id;
  const authStatus = tableItems[index].authStatus;
  if(authStatus == 0){
    helper.showError('禁用不能编辑');
    return
  }
  const {result,returnCode,returnMsg} = await helper.fetchJson(`${URL_EDIT}/${id}`);
  if(returnCode!==0){
    helper.showError(returnMsg);
    return
  }

  let options = [];
  // execWithLoading(async () => {
  const json = await helper.fetchJson(URL_SIGN);
  if(json.returnCode !=0){
    helper.showError(json.returnMsg);
    return
  }
  for(let item of json.result){
    options.push(
      {
        title:item.signSealName,
        value:item.id,
        imgBase:item.signSealImgBase64
      }
    )
  }
  //});
  controls[2].options = options;
  if (await showDiaLog(controls,result,'编辑',true)) {
    return updateTable(dispatch, getState)
  }
};


const actionCreators = {
  onClick: clickActionCreator,
  onChange: changeActionCreator,
  onInit: initActionCreator,
  onCheck: checkActionCreator,
  onPageNumberChange: pageNumberActionCreator,
  onPageSizeChange: pageSizeActionCreator,
  onExitValid: exitValidActionCreator,
  onDoubleClick:doubleClickActionCreator
};
const Container = connect(mapStateToProps, actionCreators)(EnhanceLoading(OrderPage));
export default Container;
