import { connect } from 'react-redux';
import OrderPage from './components/OrderPage';
import {EnhanceLoading} from '../../../../components/Enhance';
import helper,{getObject, swapItems} from '../../../../common/common';
import {Action} from '../../../../action-reducer/action';
import {getPathValue} from '../../../../action-reducer/helper';
import showDiaLogOne from './ShowDiaLog/DialogContainer';
import showConfirm from './ShowDiaLog/ConfirmContainer';

const TAB_KEY = 'one';
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
      value:{},
      status: 'page',
    }, TAB_KEY));

  } catch (e) {
    helper.showError(e.message);
    dispatch(action.assign({status: 'retry'}, TAB_KEY));
  }
};

const zzjgdmAction = () => async (dispatch, getState) => {
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
  zzjgdm:zzjgdmAction,
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
