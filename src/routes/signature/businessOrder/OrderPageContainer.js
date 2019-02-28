import { connect } from 'react-redux';
import OrderPage from '../../../components/OrderPage';
import {Action} from "../../../action-reducer/action";
import {getPathValue} from "../../../action-reducer/helper";
import {toFormValue} from "../../../common/check";
import {search2} from "../../../common/search";
import {fetchJson, genTabKey, getObject, postOption, showError} from "../../../common/common";
import showEditDialog from './EditDialogContainer';

const STATE_PATH = ['businessOrder'];
const action = new Action(STATE_PATH);

const URL_LIST = '/api/signature/businessOrder/list';
const URL_AUDIT = '/api/signature/businessOrder/audit';

const getSelfState = (rootstate) => {
  return getPathValue(rootstate, STATE_PATH);
};

const updateTable = async (dispatch, getState) => {
  const {currentPage, pageSize, searchDataBak = {}} = getSelfState(getState());
  return search2(dispatch, action, URL_LIST, currentPage, pageSize, toFormValue(searchDataBak));
};

const resetActionCreator = (dispatch) => {
  dispatch(action.assign({searchData: {}}));
};

const searchActionCreator = async (dispatch, getState) => {
  const {pageSize, searchData} = getSelfState(getState());
  const newState = {searchDataBak: searchData, currentPage: 1};
  return search2(dispatch, action, URL_LIST, 1, pageSize, toFormValue(searchData), newState);
};

const receiptActionCreator = async (dispatch, getState) => {
  const {editDialogConfig} = getSelfState(getState());
  if (true === await showEditDialog(editDialogConfig, {})) {
    return updateTable(dispatch, getState);
  }
};

//批量操作, 针对待审核状态
const auditActionCreator = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const validItemsIdList = tableItems.reduce((result, item) => {
    item.checked && item['orderStatus'] === 'waitAuditing' && result.push(item.id);
    return result;
  },[]);
  if (validItemsIdList.length < 1 || validItemsIdList.length !== tableItems.filter(item => item.checked).length) {
    return showError('至少勾选一条待审核的记录!');
  }
  const {returnCode, returnMsg} = await fetchJson(URL_AUDIT, postOption(validItemsIdList));
  return returnCode === 0 ? updateTable(dispatch, getState) : showError(returnMsg);
};

const toolbarActions = {
  reset: resetActionCreator,
  search: searchActionCreator,
  receipt: receiptActionCreator,
  audit: auditActionCreator
};

const clickActionCreator = (key) => {
  if (toolbarActions.hasOwnProperty(key)) {
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
  const {pageSize, searchDataBak={}} = getSelfState(getState());
  const newState = {currentPage};
  return search2(dispatch, action, URL_LIST, currentPage, pageSize, searchDataBak, newState);
};

const pageSizeActionCreator = (pageSize, currentPage) => (dispatch, getState) => {
  const {searchDataBak={}} = getSelfState(getState());
  const newState = {pageSize, currentPage};
  return search2(dispatch, action, URL_LIST, currentPage, pageSize, searchDataBak, newState);
};

//filter onSearch事件
const formSearchActionCreator = (key, filter, config) => async (dispatch, getState) => {
  console.log(key, filter, config);
};

//展示详细
const linkActionCreator = (key, rowIndex, item) => async (dispatch, getState) => {
};

const actionCreators = {
  onClick: clickActionCreator,
  onChange: changeActionCreator,
  onCheck: checkActionCreator,
  onPageNumberChange: pageNumberActionCreator,
  onPageSizeChange: pageSizeActionCreator,
  onSearch: formSearchActionCreator,
  onLink: linkActionCreator,
};

const mapStateToProps = (state) => {
  return getObject(getSelfState(state), OrderPage.PROPS);
};

export default connect(mapStateToProps, actionCreators)(OrderPage);
