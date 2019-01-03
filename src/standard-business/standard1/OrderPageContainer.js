import { connect } from 'react-redux';
import OrderPage from '../../components/OrderPage';
import {Action} from '../../action-reducer/action';
import {getPathValue} from '../../action-reducer/helper';
import helper, {getObject, fetchJson, showError} from '../../common/common';
import {search2} from '../../common/search';
import {buildEditDialogState} from '../../common/state';
import {fetchDictionary2, setDictionary} from '../../common/dictionary';
import {showImportDialog} from '../../common/modeImport';
import {createContainer} from '../../routes/bill/receive/EditRemark/EditRemarkContainer';
import showDialog from '../../standard-business/showDialog';
import {toFormValue} from "../../common/check";
const URL_CLIENT = '/api/basic/client2/base/business_drop_list';
const URL_CUSTOMER_OPTIONS = '/api/config/archiverService/search/name';

const createOrderPageContainer = (urls, statePath, unique, importCode) => {
  const {URL_LIST, URL_ACTIVE, URL_INVALID,URL_SET_RULE} = urls;
  const STATE_PATH = statePath;
  const action = new Action(STATE_PATH);

  const getSelfState = (rootState) => {
    return getPathValue(rootState, STATE_PATH);
  };

  const changeActionCreator = (key, value) => {
    return action.assign({[key]: value}, 'searchData');
  };

  // 搜索
  const searchAction = async (dispatch, getState) => {
    const {pageSize, searchData} = getSelfState(getState());
    const newState = {searchDataBak: searchData, currentPage: 1};
    return search2(dispatch, action, URL_LIST, 1, pageSize, searchData, newState);
  };

//刷新表格
  const updateTable = async (dispatch, getState) => {
    const {currentPage, pageSize, searchDataBak={}} = getSelfState(getState());
    return search2(dispatch, action, URL_LIST, currentPage, pageSize, toFormValue(searchDataBak));
  };

  // 清空搜索框
  const resetActionCreator = () => {
    return action.assign({searchData: {}});
  };

  // 弹出新增对话框
  const addAction = (dispatch, getState) => {
    const {editConfig} = getSelfState(getState());
    const payload = buildEditDialogState(editConfig, {}, false);
    dispatch(action.assign(payload, 'edit'));
  };

  // 弹出编辑对话框
  const editAction = async (dispatch, getState) => {
    const {tableItems, editConfig} = getSelfState(getState());
    const index = helper.findOnlyCheckedIndex(tableItems);
    if (index !== -1) {
      const payload = buildEditDialogState(editConfig, tableItems[index], true);
      dispatch(action.assign(payload, 'edit'));
    }
  };

  const doubleClickActionCreator = (index) => (dispatch, getState) => {
    const {tableItems, editConfig} = getSelfState(getState());
    const payload = buildEditDialogState(editConfig, tableItems[index], true);
    dispatch(action.assign(payload, 'edit'));
  };

  // 编辑完成后的动作
  const afterEditActionCreator = (item, edit) => (dispatch) => {
    if (item) {
      if (!edit) {
        dispatch(action.add(item, 'tableItems', 0));
      } else {
        const index = {key: unique, value: item[unique]};
        dispatch(action.update(item, 'tableItems', index));
      }
      helper.showSuccessMsg('保存成功');
    }
    dispatch(action.assign({edit: undefined}));
  };

  // 删除(失效)
  const delAction = async (dispatch, getState) => {
    const {tableItems} = getSelfState(getState());
    const ids = tableItems.filter(item => item.checked === true).map(item => item[unique]);
    if (ids.length > 0) {
      const {returnCode, returnMsg} = await fetchJson(URL_INVALID, helper.postOption(ids, 'put'));
      if (returnCode === 0) {
        helper.showSuccessMsg('记录已失效');
        return updateTable(dispatch, getState);
      } else {
        showError(returnMsg);
      }
    }else {
      helper.showError('请先勾选记录');
    }
  };

  // 激活
  const activeAction = async (dispatch, getState) => {
    const {tableItems} = getSelfState(getState());
    const ids = tableItems.filter(item => item.checked === true).map(item => item[unique]);
    if (ids.length > 0) {
      const {returnCode, returnMsg} = await fetchJson(URL_ACTIVE, helper.postOption(ids, 'put'));
      if (returnCode === 0) {
        helper.showSuccessMsg('记录已激活');
        return updateTable(dispatch, getState);
      } else {
        showError(returnMsg);
      }
    }else {
      helper.showError('请先勾选记录');
    }
  };

  //导入功能
  const importActionCreator = () => {
    return showImportDialog(importCode);
  };

  //设置分摊规则
  const setRuleActionCreator =async(dispatch,getState) => {
    const {tableItems,apportionmentRuleConfig} = getSelfState(getState());
    let checkeds = [];
    tableItems.filter(x=>{
      if(x.checked){
        checkeds.push(x.id);
      }});
    if(checkeds.length<1){return showError("请选择后设置！")}
    return showDialog(createContainer,{idList:checkeds,value:{},updateTable1:searchAction,urlSave:URL_SET_RULE,...apportionmentRuleConfig});
  };

  const toolbarActions = {
    reset: resetActionCreator(),
    search: searchAction,
    add: addAction,
    edit: editAction,
    del: delAction,
    active: activeAction,
    import: importActionCreator,
    setRule: setRuleActionCreator
  };

  const clickActionCreator = (key) => {
    if (toolbarActions.hasOwnProperty(key)) {
      return toolbarActions[key];
    } else {
      return {type: 'unknown'};
    }
  };

  const checkActionCreator = (isAll, checked, rowIndex) => {
    isAll && (rowIndex = -1);
    return action.update({checked}, 'tableItems', rowIndex);
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

  const mapStateToProps = (state) => {
    return getObject(getSelfState(state), OrderPage.PROPS);
  };

  const filterSearchActionCreator = (key, value) =>async(dispatch,getState)=> {
    if(key === 'customerName'){
      const option = helper.postOption({maxNumber: 10, customerName: value});
      let data = await fetchJson(URL_CLIENT, option);
      if (data.returnCode === 0) {
        dispatch(action.update({options:data.result},"filters",{key:"key",value:key}));
      }
    } else if(key === 'supplierId'){
      const option = helper.postOption({maxNumber: 20, customerName: value});
      let data = await fetchJson(URL_CUSTOMER_OPTIONS, option);
      if (data.returnCode === 0) {
        dispatch(action.update({options:data.result},"filters",{key:"key",value:key}));
      }
    }
  };

  const actionCreators = {
    onSearch:filterSearchActionCreator,
    onClick: clickActionCreator,
    onChange: changeActionCreator,
    onCheck: checkActionCreator,
    onDoubleClick: doubleClickActionCreator,
    onPageNumberChange: pageNumberActionCreator,
    onPageSizeChange: pageSizeActionCreator
  };

  const Container = connect(mapStateToProps, actionCreators)(OrderPage);
  return {Container, afterEditActionCreator};
};

export default createOrderPageContainer;
