import {connect} from 'react-redux';
import {search2} from '../../../common/search';
import {Action} from '../../../action-reducer/action';
import OrderPage from '../../../components/OrderPage';
import {getPathValue} from '../../../action-reducer/helper';
import showPopup from '../../../standard-business/showPopup';
import helper, {showError} from '../../../common/common';
import AddDialogContainer, {buildAddState} from './Credit/AddDialogContainer';
import ViewDialogContainer,{buildViewState} from './View/ViewDialogContainer';

const STATE_PATH = ['business_account'];
const action = new Action(STATE_PATH);

const URL_LIST = '/api/signature/business_account/list';
const URL_COMPANY = '/api/signature/business_account/companyName';
const URL_ORDER = '/api/signature/business_account/viewQuota';
const URL_RULE = '/api/signature/business_account/rule';

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

//判断当前页签是否存在
const isTabExist = (tabs, key) => {
  return tabs.some(tab => tab.key === key)
};

//刷新表格
const updateTable = async (dispatch, getState) => {
  const {currentPage, pageSize, searchDataBak={}} = getSelfState(getState());
  return search2(dispatch, action, URL_LIST, currentPage, pageSize, searchDataBak)
};

//搜索内容清空
const resetAction = (dispatch, getState) => {
  dispatch(action.assign({searchData:{}}));
};

//搜索
const searchAction = async (dispatch, getState) => {
  const {searchData, pageSize} = getSelfState(getState());
  const newState = {searchDataBak: searchData, currentPage: 1};
  return search2(dispatch, action, URL_LIST, 1, pageSize, searchData, newState);
};

//订购
const orderAction = async (dispatch, getState) => {
  const {editConfig, tabs, tableItems} = getSelfState(getState());
  const items = tableItems.filter(item => item.checked);
  const {returnCode, returnMsg, result} = await helper.fetchJson(URL_RULE);  //获取套餐信息
  if(returnCode !== 0){return showError(returnMsg)}
  if(items.length !==1){return helper.showError('请勾选一条记录');}
  if(isTabExist(tabs, 'edit')){
    dispatch(action.assign({activeKey: 'edit'}));
    return
  }
  const add = {...editConfig, value: items[0], rule:result};
  const tab = {key: 'edit', title: '订购'};
  dispatch(action.assign({[tab.key]: add, activeKey: tab.key, tabs: tabs.concat(tab) }))
};

//设置信用额度
const creditSettingAction = async (dispatch, getState) => {
  const {creditSettingConfig, tableItems} = getSelfState(getState());
  const items = tableItems.filter(item => item.checked);
  if(items.length !== 1){
    helper.showError('请勾选一条');
    return
  }
  if (items[0].isOverdraft === 0 && items[0]['companyAccountAmount'] < 0) return showError('当前记录不允许修改信用额度');
  buildAddState(creditSettingConfig, items[0], dispatch);
  showPopup(AddDialogContainer)
};

//查看订购记录
const viewQuotaAction =  async (dispatch, getState) => {
  const {viewQuotaConfig, tableItems} = getSelfState(getState());
  const item = tableItems.filter(item => item.checked);
  if(item.length !==1){
    helper.showError('请勾选一条');
    return
  }
  const companyOrder = item[0].companyOrder;
  const {result, returnCode, returnMsg} = await helper.fetchJson(URL_ORDER, helper.postOption({companyOrder}));
  if (returnCode !== 0) return helper.showError(returnMsg);
  buildViewState(viewQuotaConfig, result, dispatch);
  showPopup(ViewDialogContainer)
};

const toolbarActions = {
  reset: resetAction,
  search: searchAction,
  order:orderAction,
  creditSetting:creditSettingAction,
  viewQuota:viewQuotaAction
};

const clickAction = (key) => {
  if (toolbarActions.hasOwnProperty(key)) {
    return toolbarActions[key];
  } else {
    return {type: 'unknown'};
  }
};

//搜索框输入值修改
const changeAction = (key, value) => {
  return action.assign({[key]: value}, 'searchData');
};

//当前分页
const pageNumberActionCreator = (currentPage) => (dispatch, getState) => {
  const {pageSize, searchDataBak={}} = getSelfState(getState());
  const newState = {currentPage};
  return search2(dispatch, action, URL_LIST, currentPage, pageSize, searchDataBak, newState);
};

//分页数据大小
const pageSizeActionCreator = (pageSize, currentPage) => async (dispatch, getState) => {
  const {searchDataBak={}} = getSelfState(getState());
  const newState = {pageSize, currentPage};
  return search2(dispatch, action, URL_LIST, currentPage, pageSize, searchDataBak, newState);
};

//勾选
const checkAction = (isAll, checked, rowIndex) => {
  isAll && (rowIndex = -1);
  return action.update({checked}, 'tableItems', rowIndex);
};

const filterSearchActionCreator = (key, value) => async (dispatch)=> {
  if(key === 'companyId'){
    const option = helper.postOption({maxNumber: 10, companyName: value});
    let data = await helper.fetchJson(URL_COMPANY, option);
    if (data.returnCode === 0) {
      dispatch(action.update({options: data.result},'filters',{key: 'key', value: key}));
    }
  }
};

const actionCreators = {
  onClick: clickAction,
  onChange: changeAction,
  onSearch: filterSearchActionCreator,
  onCheck: checkAction,
  onPageNumberChange: pageNumberActionCreator,
  onPageSizeChange: pageSizeActionCreator,
};

const mapStateToProps = (state) => {
  return getSelfState(state)
};

const Container = connect(mapStateToProps, actionCreators)(OrderPage);
export default Container;
export {updateTable};
