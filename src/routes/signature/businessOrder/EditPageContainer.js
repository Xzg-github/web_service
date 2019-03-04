import {connect} from 'react-redux';
import EditPage from './EditPage';
import {commonExport} from "../../../common/exportExcelSetting";
import {search2} from "../../../common/search";
import {Action} from "../../../action-reducer/action";
import {getPathValue} from '../../../action-reducer/helper';

const STATE_PATH =  ['businessOrder'];
const action = new Action(STATE_PATH);

const URL_ConsumptionDetail = '/api/signature/businessOrder/consumption';

let currentKey;

const getSelfState = (rootState) => {
  const parent = getPathValue(rootState, STATE_PATH);
  currentKey = parent.activeKey
  return parent[currentKey];
};

const closeActionCreator = (props) => () => {
  props.onTabClose(currentKey);
};

//TODO: 修改接口地址联调
const exportSearchActionCreator = (dispatch, getState) => {
  const {consumptionDetail} = getSelfState(getState());
  return commonExport(consumptionDetail, '/aaaa/', {}, true, true, 'post', false);
};

const toolbarActions = {
  close: closeActionCreator,
  export: exportSearchActionCreator
};

const clickActionCreator = (props, key) => {
  if (toolbarActions.hasOwnProperty(key)) {
    return toolbarActions[key](props);
  } else {
    console.log('unknow key:', key);
    return {type: 'unknown'};
  }
};

const pageNumberActionCreator = (currentPage) => (dispatch, getState) => {
  const {pageSize} = getSelfState(getState());
  const newState = {currentPage};
  return search2(dispatch, action, URL_ConsumptionDetail, currentPage, pageSize, {}, newState);
};

const pageSizeActionCreator = (pageSize, currentPage) => (dispatch, getState) => {
  const newState = {pageSize, currentPage};
  return search2(dispatch, action, URL_ConsumptionDetail, currentPage, pageSize, {}, newState);
};

const actionCreators = {
  onClick: clickActionCreator,
  onPageNumberChange: pageNumberActionCreator,
  onPageSizeChange: pageSizeActionCreator
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

export default connect(mapStateToProps, actionCreators)(EditPage);
