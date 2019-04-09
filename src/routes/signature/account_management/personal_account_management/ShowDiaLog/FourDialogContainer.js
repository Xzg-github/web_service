import {connect} from 'react-redux';
import Dialog from './Dialog';
import {Action} from '../../../../../action-reducer/action';
import showPopup from '../../../../../standard-business/showPopup';
import helper from '../../../../../common/common';

const action = new Action(['temp'], false);
const URL_ACCOUNT = '/api/signature/account_management/personal_account_management/companyAccount';
const URL_COMPANY = '/api/signature/account_management/personal_account_management/company';

const getSelfState = (state) => {
  return state.temp || {};
};

const buildState = (config, items={},isLook) => {
  return {
    ...config,
    items,
    visible: true,
    value: items,
    isLook
  };
};

const changeActionCreator = (key, value) => {
  return action.assign({[key]: value}, 'value');
};

const okActionCreator = () => async (dispatch, getState) => {
  const {value,controls} = getSelfState(getState());
  if (!helper.validValue(controls, value)) {
    dispatch(action.assign({valid: true}));
    return;
  }
  if(!value.companyAccountId){
    helper.showError('请先获取企业信息');
    return
  }
  const body = {
    companyAccountId:value.companyAccountId,
    id:value.id
  };
  const res = helper.postOption(body);
  const {result,returnCode,returnMsg} =await helper.fetchJson(URL_COMPANY,res);
  if(returnCode !== 0) {
    helper.showError(returnMsg);
    return
  }
  helper.showSuccessMsg(returnMsg);
  dispatch(action.assign({visible: false, ok: true}));
};

const closeActionCreator = () => (dispatch) => {
  dispatch(action.assign({visible: false, ok: false}));
};

const getActionCreator = () => async(dispatch,getState) => {
  const {value} = getSelfState(getState());
  if(!value.companyOrder){
    helper.showError('所属企业编号不能为空');
    return
  }
  const body = {
    param:value.companyOrder
  };
  const {result,returnCode,returnMsg} = await helper.fetchJson(`${URL_ACCOUNT}`,helper.postOption(body));
  if(returnCode !=0){
    dispatch(action.assign({['companyName']: ''}, 'value'));
    dispatch(action.assign({['companyAccountId']:''}, 'value'));
    helper.showError(returnMsg);
    return
  }
  dispatch(action.assign({['companyName']: result.companyName}, 'value'));
  dispatch(action.assign({['companyAccountId']: result.accountId}, 'value'))
};

const clickActionCreators = {
  ok: okActionCreator,
  close: closeActionCreator,
  get:getActionCreator
};

const clickActionCreator = (key) => {
  if (clickActionCreators.hasOwnProperty(key)) {
    return clickActionCreators[key]();
  } else {
    return {type: 'unknown'};
  }
};

const exitValidActionCreator = () => {
  return action.assign({valid: false});
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onChange: changeActionCreator,
  onClick: clickActionCreator,
  onExitValid: exitValidActionCreator
};

export default async (config, items,isLook) => {

  const Container = connect(mapStateToProps, actionCreators)(Dialog);
  global.store.dispatch(action.create(buildState(config, items,isLook)));
  await showPopup(Container, {}, true);

  const state = getSelfState(global.store.getState());
  global.store.dispatch(action.create({}));
  return state.ok;
};


