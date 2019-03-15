import { connect } from 'react-redux';
import OrderPage from '../../../../components/OrderPage';
import helper,{getObject, swapItems} from '../../../../common/common';
import {toFormValue,hasSign} from '../../../../common/check';
import {Action} from '../../../../action-reducer/action';
import {getPathValue} from '../../../../action-reducer/helper';
import {search2} from '../../../../common/search';
import { exportExcelFunc, commonExport } from '../../../../common/exportExcelSetting';

const TAB_KEY = 'index';
const STATE_PATH =  ['price_management'];

const URL_LIST = '/api/signature/file_management/price_management/list';
const URL_DISABLE = '/api/signature/file_management/price_management/disable';
const URL_DEL = '/api/signature/file_management/price_management/del';
const URL_COMPANY = '/api/signature/file_management/price_management/dropCompany';

const action = new Action(STATE_PATH);

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH)[TAB_KEY];
};

// 页面的初始状态
const buildPageState = (tabs, tabKey, title,value={},edit) => {
  const {id} = value;
  return {
    activeKey: tabKey,
    tabs: tabs.concat({key: tabKey, title: title}),
    [tabKey]: {tabKey,id,updateTable,edit
    },
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

const addAction = async (dispatch, getState) => {
  const {tabs} = getPathValue(getState(), STATE_PATH);
  const tabKey = helper.genTabKey('add', tabs);
  const title =  '新增';
  dispatch(action.assign(buildPageState (tabs, tabKey,title,{},false)));
};

const findCheckedIndex1 = (items) => {
  const index = items.reduce((result = [], item, index) => {
    item.checked && result.push(index);
    return result;
  }, []);
  return !index.length ? -1 : index;
};


const delAction= async (dispatch, getState) => {
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
    retrun
  }
  helper.showSuccessMsg(returnMsg)
  return updateTable(dispatch, getState)

};


const disableAction = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const index = findCheckedIndex1(tableItems);
  if (index === -1) {
    helper.showError('请勾选一条记录进行失效');
    return;
  }
  let item = [];
  index.forEach(index => {
    item.push(tableItems[index].id)
  });
  const {result,returnCode,returnMsg} = await helper.fetchJson(`${URL_DISABLE}/status_disabled`,helper.postOption(item,'put'));
  if(returnCode !== 0 ){
    helper.showError(returnMsg);
    return
  }
  helper.showSuccessMsg(returnMsg)
  return updateTable(dispatch, getState)

};


const editAction = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const {tabs} = getPathValue(getState(), STATE_PATH);
  const index = helper.findOnlyCheckedIndex(tableItems);
  if (index === -1) {
    helper.showError('请勾选一条记录进行编辑');
    return;
  }
  const tabKey = `edit_${tableItems[index].id}`;
  const title =  '编辑';
  if (helper.isTabExist(tabs, tabKey)) {
    dispatch(action.assign({activeKey: tabKey}));
  }
  dispatch(action.assign(buildPageState (tabs, tabKey,title,tableItems[index],true)));
};



const toolbarActions = {
  add:addAction,
  edit:editAction,
  disable:disableAction,
  del:delAction,
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

};

const changeActionCreator = (key, value) => (dispatch,getState) =>{
  const {tabKey} = getSelfState(getState());
  dispatch(action.assign({[key]: value}, [tabKey,'searchData']));
};

const formSearchActionCreator = (key, title) => async (dispatch, getState) => {
  const {tabKey,filters} = getSelfState(getState());
  let body,url,json;
  switch (key) {
    case 'companyId' :{
      body = {
        maxNumber:20,
        companyName:title
      };
      url = URL_COMPANY;
      break;
    }
    default :
      return
  }
  json = await helper.fetchJson(url,helper.postOption(body));
  if(json.returnCode !== 0 ){
    helper.showError(json.returnMsg);
  }
  let options = json.result ;
  const index = filters.findIndex(item => item.key == key);
  dispatch(action.update({options}, [tabKey,'filters'], index));
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
