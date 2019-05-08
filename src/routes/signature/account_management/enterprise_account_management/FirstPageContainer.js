import { connect } from 'react-redux';
import OrderPage from './components/OrderPage';
import {EnhanceLoading} from '../../../../components/Enhance';
import helper,{getObject, swapItems} from '../../../../common/common';
import {Action} from '../../../../action-reducer/action';
import {getPathValue} from '../../../../action-reducer/helper';
import showDiaLogOne from './ShowDiaLog/DialogContainer';
import showDiaLog from '../../signature_center/showDiaLog/AddDialogContainer';
import showPhoneDiaLog from './ShowDiaLog/NotifyPhoneDiaLogContainer';


const TAB_KEY = 'one';
const STATE_PATH =  ['enterprise_account_management'];

const URL_LIST = '/api/signature/account_management/enterprise_account_management/oneList';
const URL_DAYS = '/api/signature/account_management/enterprise_account_management/updateDays';
const URL_EMAIL = '/api/signature/account_management/personal_account_management/email';
const URL_PHONE = '/api/signature/account_management/personal_account_management/phone';


const updateTable = async(dispatch,getState)  =>{
  const result =  helper.getJsonResult(await helper.fetchJson(`${URL_LIST}`));
  result.grzh = result.registerType === 'phone_number' ? result.phone : result.email;
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
    result.grzh = result.registerType === 'phone_number' ? result.phone : result.email;
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
  const controls = [
    {key:'identNo',title:'组织机构代码或者统一社会信息代码 ',type:'text',required:true},
    {key:'name',title:'企业名称',type:'text',required:true},
  ];
  if (await showDiaLog(controls, {} ,false)) {
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

const toolbarActions = {
  accountPassword:passwordAction,
  companyName:companyNameAction,
  notifyPhone:notifyPhoneAction
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
    if(!state.value.email){
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
      return helper.showError('没有手机号,不能修改手机通知')
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
