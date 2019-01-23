import { connect } from 'react-redux';
import OrderPage from './components/OrderPage';
import {EnhanceLoading} from '../../../../components/Enhance';
import helper,{getObject, swapItems} from '../../../../common/common';
import {Action} from '../../../../action-reducer/action';
import {getPathValue} from '../../../../action-reducer/helper';
import execWithLoading from '../../../../standard-business/execWithLoading';

const TAB_KEY = 'one';
const STATE_PATH =  ['personal_certification'];

const URL_USER = '/api/fadada/user'; //校验是否通过认证   0：禁用，1：待认证，2：认证失败 3:已认证

const action = new Action(STATE_PATH);

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH)[TAB_KEY];
};

const initActionCreator = () => async (dispatch, getState) => {
  const state = getSelfState(getState());
  console.log(state);
  dispatch(action.assign({status: 'loading'}, TAB_KEY));
  try {
    dispatch(action.assign({
      ...state,
      text:'校验验证',
      type:'default',
      status: 'page',
      disabled:false,
    }, TAB_KEY));

  } catch (e) {
    helper.showError(e.message);
    dispatch(action.assign({status: 'retry'}, TAB_KEY));
  }
};



const toolbarActions = {
};

const clickActionCreator = (key) => {
  if (toolbarActions.hasOwnProperty(key)) {
    return toolbarActions[key];
  } else {
    console.log('unknown key:', key);
    return {type: 'unknown'};
  }
};

const changeActionCreator = (key, value) => (dispatch,getState) =>{
  dispatch(action.assign({[key]: value}, [TAB_KEY,'value']));
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};


const exitValidActionCreator = () => {
  return action.assign({valid: false},TAB_KEY);
};


const verificationAtionCreator = () => async(dispatch,getState) =>{
  const {text,strCookie,accountId} = getSelfState(getState());
  if(text === '已认证'){
    return
  }
  execWithLoading(async()=>{
    const {result,returnCode,returnMsg} = await helper.fetchJson(`${URL_USER}/${accountId}`);
    if(returnCode != 0){
      helper.showError(returnCode);
      return
    }


    if(result.userAccountState == 0){
      helper.showError('该账号禁止使用');
      return
    }else if(result.userAccountState == 1){
      helper.showError('该账号待认证');
      return
    }else if(result.userAccountState == 2){
      helper.showError('该账号认证失败');
      return
    }else if(result.userAccountState == 3){
      helper.showSuccessMsg('该账号认证成功');
      dispatch(action.assign({text:'已认证',type:'primary'},TAB_KEY));
      return
    }

  });
};


const actionCreators = {
  onClick: clickActionCreator,
  onChange: changeActionCreator,
  onInit: initActionCreator,
  onExitValid: exitValidActionCreator,
  verification:verificationAtionCreator
};

const Container = connect(mapStateToProps, actionCreators)(EnhanceLoading(OrderPage));
export default Container;
