import { connect } from 'react-redux';
import SecondPage from './components/SecondPage';
import {EnhanceLoading} from '../../../../components/Enhance';
import helper,{getObject, swapItems} from '../../../../common/common';
import {Action} from '../../../../action-reducer/action';
import {getPathValue} from '../../../../action-reducer/helper';
import showDiaLog from './ShowDiaLog/UploadDialogContainer';


const TAB_KEY = 'two';
const STATE_PATH =  ['enterprise_account_management'];


const action = new Action(STATE_PATH);

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH)[TAB_KEY];
};

const initActionCreator = () => async (dispatch, getState) => {
  const state = getSelfState(getState());

  dispatch(action.assign({status: 'loading'}, TAB_KEY));
  try {
    dispatch(action.assign({
      ...state,
      checkValue:{},
      radioValue:{},
      status: 'page',
    }, TAB_KEY));

  } catch (e) {
    helper.showError(e.message);
    dispatch(action.assign({status: 'retry'}, TAB_KEY));
  }
};

const addAction = () => async (dispatch, getState) => {
  const {edit} = getSelfState(getState());

  if (await showDiaLog(edit,{},false)) {

  }
};

const toolbarActions = {
  add:addAction
};

const clickActionCreator = (key) => {
  if (toolbarActions.hasOwnProperty(key)) {
    return toolbarActions[key]();
  } else {
    return {type: 'unknown'};
  }
};

const changeActionCreator = (key, value) => (dispatch,getState) =>{
  dispatch(action.assign({[key]: value}, [TAB_KEY,'value']));
};

const checkActionCreator = (checked,key) => (dispatch,getState) =>{
  dispatch(action.assign({[key]: checked}, [TAB_KEY,'checkValue']))
};

const radioActionCreator = (radio,key) => (dispatch,getState) =>{
  dispatch(action.assign({[key]: radio}, [TAB_KEY,'radioValue']))
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
  onExitValid: exitValidActionCreator,
  onCheck:checkActionCreator,
  onRadio:radioActionCreator
};

const Container = connect(mapStateToProps, actionCreators)(EnhanceLoading(SecondPage));
export default Container;
