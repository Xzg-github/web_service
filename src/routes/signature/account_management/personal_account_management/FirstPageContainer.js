import { connect } from 'react-redux';
import OrderPage from './components/OrderPage';
import {EnhanceLoading} from '../../../../components/Enhance';
import helper,{getObject, swapItems} from '../../../../common/common';
import {Action} from '../../../../action-reducer/action';
import {getPathValue} from '../../../../action-reducer/helper';
import showDiaLogOne from './ShowDiaLog/DialogContainer';
import showDiaLogFour from './ShowDiaLog/FourDialogContainer';
import showPhoneDiaLog from '../enterprise_account_management/ShowDiaLog/NotifyPhoneDiaLogContainer';


const TAB_KEY = 'one';
const STATE_PATH =  ['personal_account_management'];

const URL_LIST = '/api/signature/account_management/personal_account_management/person';
const URL_DAYS = '/api/signature/account_management/personal_account_management/updateDays';
const URL_EMAIL = '/api/signature/account_management/personal_account_management/email';
const URL_PHONE = '/api/signature/account_management/personal_account_management/phone';

const updateTable = async(dispatch,getState)  =>{
  const result =  helper.getJsonResult(await helper.fetchJson(`${URL_LIST}`));
  result.isNotifiedByEmail = result.isNotifiedByEmail === 'true' ? true : false;
  result.isNotifiedByPhone = result.isNotifiedByPhone === 'true' ? true : false;
  dispatch(action.assign({value: {...result}},TAB_KEY))
};


const action = new Action(STATE_PATH);

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH)[TAB_KEY];
};

const initActionCreator = () => async (dispatch, getState) => {
  const state = getSelfState(getState());

  dispatch(action.assign({status: 'loading'}, TAB_KEY));
  try {
    const result =  helper.getJsonResult(await helper.fetchJson(`${URL_LIST}`));
    result.isNotifiedByEmail = result.isNotifiedByEmail === 'true' ? true : false;
    result.isNotifiedByPhone = result.isNotifiedByPhone === 'true' ? true : false;
    dispatch(action.assign({
      ...state,
      value:{...result,accountPassword:'******'},
      status: 'page',
    }, TAB_KEY));

  } catch (e) {
    helper.showError(e.message);
    dispatch(action.assign({status: 'retry'}, TAB_KEY));
  }
};

const passwordAction = () => async (dispatch, getState) => {
  const {diaLogOne} = getSelfState(getState());
  if (await showDiaLogOne(diaLogOne,{})) {

  }
};

const companyNameAction = () => async (dispatch, getState) => {
  const {diaLogFour,value} = getSelfState(getState());
  let companyOrder = value.companyOrder ? value.companyOrder : null;
  let companyName = value.companyName ? value.companyName : null;
  let isLook = true;
  switch (value.companyAuditState){
    case 0:{
      isLook = false;
      break
    }
    case 1:{
      isLook = false
      break
    }
    case 2:{
      break
    }
    case 3:{
      break
    }
    case 4: {
      break
    }
    default :{
      break
    }
  }
  let companyAccountId = value.companyAccountId ? value.companyAccountId : '';
  if (await showDiaLogFour(diaLogFour,{id:value.id,companyOrder,companyName,companyAccountId},isLook)) {
    return updateTable(dispatch, getState)
  }
};

const notifyPhoneAction = () => async (dispatch, getState) => {
  const {value} = getSelfState(getState());
  const controls = [
    {key:'notifyPhone',title:'电话 ',type:'number',required:true},
  ];
  if (await showPhoneDiaLog(controls, {} ,false)) {
    return updateTable(dispatch,getState)
  }
};

const notifyEmailAction = () => async (dispatch, getState) => {
  const {value} = getSelfState(getState());
  const controls = [
    {key:'notifyEmail',title:'邮箱 ',type:'text',required:true},
  ];
  if (await showPhoneDiaLog(controls, {} ,false)) {
    return updateTable(dispatch,getState)
  }
};


const toolbarActions = {
  accountPassword:passwordAction,
  companyName:companyNameAction,
  notifyPhone:notifyPhoneAction,
  notifyEmail:notifyEmailAction
};

const clickActionCreator = (key) => {
  if (toolbarActions.hasOwnProperty(key)) {
    return toolbarActions[key]();
  } else {
    return {type: 'unknown'};
  }
};

const changeActionCreator = (key, value) => async(dispatch,getState) =>{
  const state = getSelfState(getState());
  let body;
  if(key === 'daysOfAdvanceNotice'){
    body = {
      id : state.value.id,
      daysOfAdvanceNotice:value
    };
    const {result,returnCode,returnMsg} = await helper.fetchJson(URL_DAYS,helper.postOption(body));
    if(returnCode !== 0){
      helper.showError(returnMsg);
      return
    }
  }else  if(key === 'isNotifiedByEmail'){
    if(!state.value.notifyEmail){
      return helper.showError('没有邮箱账号,不能修改邮箱通知')
    }
    body = {
      accountSecureId : state.value.accountSecureId,
      isNotified:value+''
    };
    const {result,returnCode,returnMsg} = await helper.fetchJson(URL_EMAIL,helper.postOption(body));
    if(returnCode !== 0){
      helper.showError(returnMsg);
      return
    }
  }else  if(key === 'isNotifiedByPhone'){
    if(!state.value.notifyPhone){
      return helper.showError('没有邮箱账号,不能修改邮箱通知')
    }
    body = {
      accountSecureId : state.value.accountSecureId,
      isNotified:value+''
    };
    const {result,returnCode,returnMsg} = await helper.fetchJson(URL_PHONE,helper.postOption(body));
    if(returnCode !== 0){
      helper.showError(returnMsg);
      return
    }
  }
  dispatch(action.assign({[key]: value}, [TAB_KEY,'value']));
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};


const exitValidActionCreator = () => {
  return action.assign({valid: false},TAB_KEY);
};


const actionCreators = {
  onClick: clickActionCreator,
  onChange: changeActionCreator,
  onInit: initActionCreator,
  onExitValid: exitValidActionCreator
};

const Container = connect(mapStateToProps, actionCreators)(EnhanceLoading(OrderPage));
export default Container;
