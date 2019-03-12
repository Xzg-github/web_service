import { connect } from 'react-redux';
import OrderPage from './components/OrderPage';
import {EnhanceLoading} from '../../../../components/Enhance';
import helper,{getObject, swapItems} from '../../../../common/common';
import {Action} from '../../../../action-reducer/action';
import {getPathValue} from '../../../../action-reducer/helper';
import showDiaLogOne from './ShowDiaLog/DialogContainer';
import showDiaLogFour from './ShowDiaLog/FourDialogContainer';


const TAB_KEY = 'one';
const STATE_PATH =  ['personal_account_management'];

const URL_LIST = '/api/signature/account_management/personal_account_management/person';
const URL_DAYS = '/api/signature/account_management/personal_account_management/updateDays';
const URL_EMAIL = '/api/signature/account_management/personal_account_management/email';
const URL_PHONE = '/api/signature/account_management/personal_account_management/phone';


function getCookie(cookieName) {
  let strCookie = document.cookie;
  let arrCookie = strCookie.split("; ");
  for(let i = 0; i < arrCookie.length; i++){
    let arr = arrCookie[i].split("=");
    if(cookieName == arr[0]){
      return arr[1];
    }
  }
  return "";
}

const updateTable = async(dispatch,getState)  =>{
  let accountId =  getCookie('accountId');
  const result =  helper.getJsonResult(await helper.fetchJson(`${URL_LIST}/${accountId}`));
  result.grzh = result.registerType === 'phone_number' ? result.notifyPhone : result.notifyEmail;
  result.isNotifiedByEmail = result.isNotifiedByEmail === 'true' ? true : false;
  result.isNotifiedByPhone = result.isNotifiedByPhone === 'true' ? true : false;
  dispatch(action.assign({value: {...result}}))
};


const action = new Action(STATE_PATH);

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH)[TAB_KEY];
};

const initActionCreator = () => async (dispatch, getState) => {
  const state = getSelfState(getState());

  dispatch(action.assign({status: 'loading'}, TAB_KEY));
  try {
    let accountId =  getCookie('accountId');
    const result =  helper.getJsonResult(await helper.fetchJson(`${URL_LIST}/${accountId}`));
    result.grzh = result.registerType === 'phone_number' ? result.notifyPhone : result.notifyEmail;
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

  if (await showDiaLogFour(diaLogFour,{id:value.id})) {
    return updateTable(dispatch, getState)
  }
};


const toolbarActions = {
  accountPassword:passwordAction,
  companyName:companyNameAction
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
