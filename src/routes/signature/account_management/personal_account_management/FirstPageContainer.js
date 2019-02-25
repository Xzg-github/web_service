import { connect } from 'react-redux';
import OrderPage from './components/OrderPage';
import {EnhanceLoading} from '../../../../components/Enhance';
import helper,{getObject, swapItems} from '../../../../common/common';
import {Action} from '../../../../action-reducer/action';
import {getPathValue} from '../../../../action-reducer/helper';
import showDiaLogOne from './ShowDiaLog/DialogContainer';
import showConfirm from './ShowDiaLog/ConfirmContainer';

const TAB_KEY = 'one';
const STATE_PATH =  ['personal_account_management'];

const URL_LIST = '/api/signature/account_management/personal_account_management/person';


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
    result.grzh = result.registerType === 'phone_number' ? result.phoneNumber : '';
    dispatch(action.assign({
      ...state,
      value:{...result,password:'******'},
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

const dgyhzhAction = () => async (dispatch, getState) => {
  if (await showConfirm()) {

  }
};

const frxmAction = () => async (dispatch, getState) => {
  const {diaLogTwo} = getSelfState(getState());
  if (await showDiaLogOne(diaLogTwo,{})) {

  }
};

const toolbarActions = {
  password:passwordAction,
  dgyhzh:dgyhzhAction,
  frxm:frxmAction
};

const clickActionCreator = (key) => {
  if (toolbarActions.hasOwnProperty(key)) {
    return toolbarActions[key]();
  } else {
    return {type: 'unknown'};
  }
};

const changeActionCreator = (key, value) => (dispatch,getState) =>{
  console.log(value);
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
