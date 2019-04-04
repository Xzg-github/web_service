import { connect } from 'react-redux';
import OrderPage from '../../../components/OrderPage';
import {Action} from "../../../action-reducer/action";
import {getPathValue} from "../../../action-reducer/helper";
import {toFormValue} from "../../../common/check";
import {search2} from "../../../common/search";
import {fetchJson, getObject, postOption, showError} from "../../../common/common";
import showEditDialog from './EditDialogContainer';
import helper from "../../../common/common";
import showLookDialog from '../account_management/enterprise_account_management/ShowDiaLog/LookDialogContainer'

const STATE_PATH = ['businessOrder'];
const action = new Action(STATE_PATH);

const URL_LIST = '/api/signature/businessOrder/list';
const URL_AUDIT = '/api/signature/businessOrder/audit';
const URL_DETAIL = '/api/signature/businessOrder/detail';
const URL_COMPANY = '/api/signature/businessOrder/company';
const URL_LOOK = '/api/signature/account_management/enterprise_account_management/config'; //查看消费记录配置信息
const URL_RECORD = '/api/signature/account_management/enterprise_account_management/record';//根据id获取账单信息

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

//单项操作 针对待审核状态
const auditActionCreator = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const validItem = tableItems.reduce((result, item) => {
    item.checked && item['orderStatus'] === 0 && result.push(item);
    return result;
    }, []);
  if (validItem.length !== 1) return showError('请选择一条未支付的记录')
  const {returnCode, returnMsg} = await fetchJson(`${URL_AUDIT}/${validItem[0]['nativeOrderNo']}`);
  return returnCode === 0 ? updateTable(dispatch, getState) : showError(returnMsg);
};

const recordActionCreator = async (dispatch, getState) => {
  const {four} = helper.getJsonResult(await helper.fetchJson(URL_LOOK));
  const {tableItems} = getSelfState(getState());
  const index = helper.findOnlyCheckedIndex(tableItems);
  if (index === -1) return showError('请选择一条消费记录');
  //获取详细数据
  const {result,returnCode,returnMsg} = await helper.fetchJson(`${URL_RECORD}/${tableItems[index].id}`);
  if (returnCode !== 0) return showError(returnMsg);
  await showLookDialog(four['look'], result);
};

const toolbarActions = {
  reset: resetActionCreator,
  search: searchActionCreator,
  receipt: receiptActionCreator,
  audit: auditActionCreator,
  record: recordActionCreator
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
const formSearchActionCreator = (key, filter) => async (dispatch, getState) => {
  const option = helper.postOption({maxNumber: 10, companyId: filter});
  let {result, returnCode} = await fetchJson(URL_COMPANY, option);
  returnCode === 0 && dispatch(action.update({options: result},'filters',{key: 'key', value: key}));
};

//展示详细
const linkActionCreator = (key, rowIndex, item) => async (dispatch, getState) => {
  const {tabs, editPageConfig} = getSelfState(getState());
  const {returnCode, returnMsg,result} = await fetchJson(URL_DETAIL, postOption(item))
  if (returnCode !== 0) return showError(returnMsg);
  const tabKey = `id_${item.id}}`;
  if (helper.isTabExist(tabs, tabKey)) {
    dispatch(action.assign({activeKey: tabKey}));
  } else {
    const payload = {
      activeKey: tabKey,
      tabs: [...tabs, {key: tabKey, title: item['nativeOrderNo']}],
      [tabKey]: {
        ...editPageConfig, value: result
      }
    }
    dispatch(action.assign(payload));
  }
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
