import { connect } from 'react-redux';
import { Action } from '../../../action-reducer/action';
import helper,{getObject} from '../../../common/common';
import {toFormValue} from '../../../common/check';
import {search2} from '../../../common/search';
import OrderPage from '../../../components/OrderPage';
import {getPathValue} from '../../../action-reducer/helper';

const URL_LIST  = '/api/signature/data_statistics/data';

const STATE_PATH = ['data_statistics'];
const action = new Action(STATE_PATH);

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

// 搜索值变化
const onChangeActionCreator = (key, value) => async (dispatch) => {
  dispatch(action.assign({ [key]: value }, 'searchData'));
};

// 搜索条件触发
const onSearchActionCreator = async (dispatch, getState) => {
  const {searchData} = getSelfState(getState());
  const result = helper.getJsonResult(await helper.fetchJson(URL_LIST));
  if(!searchData.dataStatisticsName){
    return
  }
  let newList = result.data.filter(item => item.dataStatisticsName === searchData.dataStatisticsName);
  dispatch(action.assign({tableItems:newList}));
};

// 重置
const resetActionCreator = (dispatch, getState) => {
  dispatch(action.assign({ searchData: {} }));
};

//点击超链接查看详情
const onLinkActionCreator = (key, rowIndex, item)  => async(dispatch, getState) => {
  const {tabs, tableItems} = getPathValue(getState(), STATE_PATH);
  const item = tableItems[rowIndex];
  const tabKey = `${item.id}`;
  if (helper.isTabExist(tabs, tabKey)) {
    dispatch(action.assign({activeKey: tabKey}));
  } else {
    dispatch(action.assign({
      activeKey: tabKey,
      tabs: tabs.concat({key: tabKey, title: item.dataStatisticsName}),
      [tabKey]: {
        id: item.id,
        tabKey,
        item
      }
    }));
  }
};

const pageNumberActionCreator = (currentPage) => (dispatch, getState) => {
  const {pageSize, searchDataBak={}} = getSelfState(getState());
  const newState = {currentPage};
  return search2(dispatch, action, URL_LIST, currentPage, pageSize, searchDataBak, newState);
};

const pageSizeActionCreator = (pageSize, currentPage) => async (dispatch, getState) => {
  const {searchDataBak={}} = getSelfState(getState());
  const newState = {pageSize, currentPage};
  return search2(dispatch, action, URL_LIST, currentPage, pageSize, searchDataBak, newState);
};

const toolbarActions = {
  search: onSearchActionCreator,
  reset: resetActionCreator,
};

const clickActionCreator = (key) => {
  if (toolbarActions.hasOwnProperty(key)) {
    return toolbarActions[key];
  } else {
    console.log('unknown key:', key);
    return {type: 'unknown'};
  }
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};
const actionCreators = {
  onClick: clickActionCreator,
  onChange: onChangeActionCreator,
  onSearch: onSearchActionCreator,
  onLink: onLinkActionCreator,
  onPageNumberChange: pageNumberActionCreator,
  onPageSizeChange: pageSizeActionCreator,
};

const Container = connect(mapStateToProps, actionCreators)(OrderPage);
export default Container;
