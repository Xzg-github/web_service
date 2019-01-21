import {connect} from 'react-redux';
import {search2} from '../../../common/search';
import {Action} from '../../../action-reducer/action';
import OrderPage from '../../../components/OrderPage';
import {getPathValue} from '../../../action-reducer/helper';

const URL_LIST = './api/signature/business_account/list';

const STATE_PATH = ['business_account'];
const action = new Action(STATE_PATH);
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

//搜索框输入值修改
const changeAction = (key, value) => {
  return action.assign({[key]: value}, 'searchData');
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

//订购
const orderAction = () => {

};

//设置信用额度
const creditSettingAction = ( ) => {

};

//查看订购记录
const viewQuotaAction = () => {

};

const mapStateToProps = (state) => {
  return getSelfState(state)
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

const actionCreators = {
  onClick: clickAction,
  onChange: changeAction,
  onSearch: searchAction,
  onCheck: checkAction,
  onPageNumberChange: pageNumberActionCreator,
  onPageSizeChange: pageSizeActionCreator,
};

const Container = connect(mapStateToProps, actionCreators)(OrderPage);
export default Container;
export {updateTable};


