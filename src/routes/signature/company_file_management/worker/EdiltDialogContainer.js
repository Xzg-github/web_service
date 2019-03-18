import {connect} from 'react-redux';
import EditDialog from './EditDialog';
import {Action} from '../../../../action-reducer/action';
import showPopup from '../../../../standard-business/showPopup';
import helper from '../../../../common/common';
import {toFormValue} from "../../../../common/check";
import {search, search2} from '../../../../common/search';

const action = new Action(['temp'], false);
const URL_STATUS = '/api/signature/company_file_management/worker/status';
const URL_LIST = '/api/signature/company_file_management/worker/list';

const getSelfState = (state) => {
  return state.temp || {};
};

const buildState = ( items,config) => {
  return {
    title: '审核',
    visible: true,
    items,
    config: config
  };
};

//刷新表格
const updateTable = async (dispatch, getState) => {
  const {currentPage, pageSize, searchDataBak={}} = getSelfState(getState());
  return search2(dispatch, action, URL_LIST, currentPage, pageSize, toFormValue(searchDataBak));
};

const okActionCreator = () => async (dispatch, getState) => {
  const state = getSelfState(getState());
  const id = state.items.id;
  const {returnCode,returnMsg} = await helper.fetchJson(URL_STATUS, helper.postOption({id, userAccountState: '3'}, 'post'));
  if(returnCode === 0){
    helper.showSuccessMsg('审核通过');
    dispatch(action.assign({visible: false, ok: false}));
    return updateTable(dispatch, getState)
  }else{
    helper.showError(returnMsg)
  }
};

const closeActionCreator = () => (dispatch) => {
  dispatch(action.assign({visible: false, ok: false}));
};

const rejectActionCreator = () => async (dispatch, getState) => {
  const state = getSelfState(getState());
  const id = state.items.id;
  const {returnCode,returnMsg} = await helper.fetchJson(URL_STATUS, helper.postOption({id, userAccountState: '2'}, 'post'));
  if(returnCode === 0){
    helper.showSuccessMsg('审核不通过');
    dispatch(action.assign({visible: false, ok: false}));
    return updateTable(dispatch, getState)
  }else{
    helper.showError(returnMsg)
  }
};

const clickActionCreators = {
  cancel: closeActionCreator,
};

const clickActionCreator = (key) => {
  if (clickActionCreators.hasOwnProperty(key)) {
    return clickActionCreators[key]();
  } else {
    return {type: 'unknown'};
  }
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onClick: clickActionCreator,
  ok: okActionCreator,
  cancel: closeActionCreator,
  reject: rejectActionCreator,
};

export default async (items={}, config) => {
  const Container = connect(mapStateToProps, actionCreators)(EditDialog);
  global.store.dispatch(action.create(buildState(items,config)));
  await showPopup(Container, {}, true);

  const state = getSelfState(global.store.getState());
  global.store.dispatch(action.create({}));
  return state.ok;
};

