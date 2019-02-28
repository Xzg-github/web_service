import { connect } from 'react-redux';
import OrderPage from './OrderPage';
import helper,{getObject, swapItems} from '../../../../common/common';
import {toFormValue,hasSign} from '../../../../common/check';
import {Action} from '../../../../action-reducer/action';
import {getPathValue} from '../../../../action-reducer/helper';
import {search} from '../../../../common/search';
import {handleList} from './RootContainer'

const TAB_KEY = 'index';
const STATE_PATH =  ['signature_group'];

const URL_LIST = '/api/signature/file_management/signature_group/list';
const URL_DEL = '/api/signature/file_management/signature_group/delete';
const URL_ONE = '/api/signature/file_management/signature_group/getId';//获取单条

const toTableItems = ({keys, data}) => {
  if (!keys) {
    return data;
  } else {
    return data.map((item) => {
      const children = keys.slice(1).reduce((state, key) => {
        state[key] = item[key];
        return state;
      }, {});
      return Object.assign(item[keys[0]], {children});
    });
  }
};


const search2 = async (dispatch, action, url, currentPage, pageSize, filter, newState={}, path=undefined) => {
  const from = (currentPage - 1) * pageSize;
  const to = from + pageSize;
  const {returnCode, returnMsg, result} = await search(url, from, to, filter);
  result.data = handleList(result.data);
  if (returnCode === 0) {
    const payload = {
      ...newState,
      tableItems: toTableItems(result),
      maxRecords: result.returnTotalItem
    };
    dispatch(action.assign(payload, path));
  } else {
    helper.showError(returnMsg);
  }
};

const action = new Action(STATE_PATH);

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH)[TAB_KEY];
};

// 页面的初始状态
const buildPageState = (tabs, tabKey, title,value={}) => {
  const {id} = value;
  return {
    activeKey: tabKey,
    tabs: tabs.concat({key: tabKey, title: title}),
    [tabKey]: {tabKey,id,updateTable,title,value},
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

const addActionCreator = async (dispatch, getState) => {
  const {tabs} = getPathValue(getState(), STATE_PATH);
  const tabKey = helper.genTabKey('add', tabs);
  const title = '新增';
  dispatch(action.assign(buildPageState (tabs, tabKey,title)));
};

const editActionCreator = async (dispatch, getState) => {
  const {tabs} = getPathValue(getState(), STATE_PATH);
  const {tableItems} = getSelfState(getState());
  const index = helper.findOnlyCheckedIndex(tableItems);
  if (index === -1) {
    helper.showError('请勾选一条记录进行编辑');
    return;
  }else {
    const url = `${URL_ONE}/${tableItems[index].id}`;
    const {result,returnCode,returnMsg} = await helper.fetchJson(url);
    if(returnCode!=0){
      helper.showError(returnMsg)
      return
    }

    const tabKey = `edit_${tableItems[index].id}`;
    let title = `编辑_${tableItems[index].signGroupName}`;
    if (helper.isTabExist(tabs, tabKey)) {
      dispatch(action.assign({activeKey: tabKey}));
    } else {

      dispatch(action.assign(buildPageState (tabs,tabKey,title,result)));
    }

  }
};

const findCheckedIndex1 = (items) => {
  const index = items.reduce((result = [], item, index) => {
    item.checked && result.push(index);
    return result;
  }, []);
  return !index.length ? -1 : index;
};

const delActionCreator = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const index = findCheckedIndex1(tableItems);
  if (index === -1) {
    helper.showError('请勾选记录进行删除');
    return;
  }else {
    let ids = [];
    index.forEach(index => {
      ids.push(tableItems[index].id)
    });

    const json = await helper.fetchJson(URL_DEL,helper.postOption(ids));

    if(json.returnCode !== 0) {
      helper.showError(json.returnMsg);
      return
    }
    helper.showSuccessMsg('删除成功');
    return updateTable(dispatch,getState)
  }
};


const toolbarActions = {
  search: searchClickActionCreator,
  reset: resetActionCreator,
  add: addActionCreator,
  edit:editActionCreator,
  del:delActionCreator
};

const clickActionCreator = (key) => {
  if (toolbarActions.hasOwnProperty(key)) {
    return toolbarActions[key];
  } else {
    console.log('unknown key:', key);
    return {type: 'unknown'};
  }
};

const onLinkActionCreator = (key, rowIndex, item)  => async (dispatch,getState) => {
  const {tabs} = getPathValue(getState(), STATE_PATH);
  const tabKey = helper.genTabKey('look', tabs);
  const title =  item.a + '-查看月账单';
  dispatch(action.assign(buildPageState (tabs, tabKey,title,item)));
};

const changeActionCreator = (key, value) => (dispatch,getState) =>{
  const {tabKey} = getSelfState(getState());
  dispatch(action.assign({[key]: value}, [tabKey,'searchData']));
};

const formSearchActionCreator = (key, title,keyControl) => async (dispatch, getState) => {
  const {filters,tabKey} = getSelfState(getState());
  const json = await helper.fuzzySearch(keyControl.searchType, title);
  if (!json.returnCode) {
    const index = filters.findIndex(item => item.key == key);
    dispatch(action.update({options:json.result}, [tabKey,'filters'], index));
  }else {
    helper.showError(json.returnMsg)
  }
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
