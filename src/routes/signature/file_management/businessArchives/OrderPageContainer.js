import { connect } from 'react-redux';
import OrderPage from '../../../../components/OrderPage';
import {Action} from "../../../../action-reducer/action";
import {getPathValue} from "../../../../action-reducer/helper";
import {toFormValue} from "../../../../common/check";
import {search2} from "../../../../common/search";
import {commonExport, exportExcelFunc} from "../../../../common/exportExcelSetting";
import {fetchJson, genTabKey, getObject, showError, deepCopy} from "../../../../common/common";
import helper from "../../../../common/common";

const STATE_PATH = ['businessArchives'];
const action = new Action(STATE_PATH);

const URL_LIST = '/api/signature/file_management/businessArchives/list';
const URL_DETAIL = '/api/signature/file_management/businessArchives/detail';
const URL_COMPANY = '/api/signature/businessOrder/company';

const getSelfState = (rootstate) => {
  return getPathValue(rootstate, STATE_PATH);
};

const resetActionCreator = (dispatch) => {
  dispatch(action.assign({searchData: {}}));
};

const searchActionCreator = async (dispatch, getState) => {
  const {pageSize, searchData} = getSelfState(getState());
  const newState = {searchDataBak: searchData, currentPage: 1};
  return search2(dispatch, action, URL_LIST, 1, pageSize, toFormValue(searchData), newState);
};

//查询导出
const exportSearchActionCreator = (dispatch, getState) => {
  const {tableCols, searchData} = getSelfState(getState());
  return commonExport(tableCols, '/aaaa/', searchData);
};

//页面导出
const exportPageActionCreator = (dispatch, getState) => {
  const {tableCols, tableItems} = getSelfState(getState());
  return exportExcelFunc(tableCols, tableItems);
};

//新增客户
const addActionCreator = (dispatch, getState) => {
  alert('暂定');
};

const toolbarActions = {
  exportSearch: exportSearchActionCreator,
  exportPage: exportPageActionCreator,
  reset: resetActionCreator,
  search: searchActionCreator,
  add: addActionCreator
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
const formSearchActionCreator = (key, value) => async (dispatch, getState) => {
  if(key === 'companyId'){
    const option = helper.postOption({maxNumber: 10, companyId: value});
    let data = await helper.fetchJson(URL_COMPANY, option);
    if (data.returnCode === 0) {
      dispatch(action.update({options: data.result},'filters',{key: 'key', value: key}));
    }
  }
};

//设置controls为只读
const changeTypeToReadOnly = (targrt=[]) => {
  return targrt.reduce((result, item) => {
    const backUpItem = deepCopy(item);
    backUpItem.type = 'readonly';
    result.push(backUpItem);
    return result;
  },[]);
};

//展示详细
const linkActionCreator = (key, rowIndex, item) => async (dispatch, getState) => {
  const {editConfig, tabs} = getSelfState(getState());
  //依据item.id获取详细信息
  const {returnMsg, returnCode, result} = await fetchJson(`${URL_DETAIL}/${item.id}`);
  if (returnCode !== 0) return showError(returnMsg);
  const tabKey = genTabKey('look', tabs);
  const newTabs = tabs.find(tab => tab.key === tabKey)
    ? tabs
    : tabs.concat([{key: tabKey, title: item['companyOrder']}]);
  const {businessInfo, managerInfo, ...others} = editConfig;
  const backUpbusinessInfo = changeTypeToReadOnly(businessInfo);
  const backUpManagerInfo = changeTypeToReadOnly(managerInfo);
  const payload = {
    [tabKey]: {
      businessInfo: backUpbusinessInfo,
      managerInfo: backUpManagerInfo,
      ...others,
      value: result,
      isLook: true
    },
    activeKey: tabKey,
    tabs: newTabs
  };
  dispatch(action.assign(payload));
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

