import { connect } from 'react-redux';
import OrderPage from '../../components/OrderPage/OrderPage';
import {EnhanceLoading} from '../../../../components/Enhance';
import helper,{getObject, swapItems} from '../../../../common/common';
import {Action} from '../../../../action-reducer/action';
import {getPathValue} from '../../../../action-reducer/helper';
import showDiaLog from './ShowDiaLog/OrderContainer';
import showPayDiaLog from './ShowDiaLog/PayDialogContainer';
import showDiaLogOne from './ShowDiaLog/DialogContainer';
import showApplication from './ShowDiaLog/ApplicationDialogContainer';


const TAB_KEY = 'four';
const STATE_PATH =  ['personal_account_management'];


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
      status: 'page',
    }, TAB_KEY));

  } catch (e) {
    helper.showError(e.message);
    dispatch(action.assign({status: 'retry'}, TAB_KEY));
  }
};

const orderAction = () => async (dispatch, getState) => {
  const {order} = getSelfState(getState());

  if (await showDiaLog(order,[])) {

  }
};

const payAction = () => async (dispatch, getState) => {
  const {pay} = getSelfState(getState());

  if (await showPayDiaLog(pay,[],'1231233')) {

  }
};


const inputAction = () => async (dispatch, getState) => {
  const {input} = getSelfState(getState());
  if (await showDiaLogOne(input,{})) {

  }
};

const applicationAction = () => async (dispatch, getState) => {
  const {application} = getSelfState(getState());
  if (await showApplication(application,{a:'1'})) {

  }
};


const toolbarActions = {
  order:orderAction,
  pay:payAction,
  input:inputAction,
  application:applicationAction
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
