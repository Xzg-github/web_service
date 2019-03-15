import {connect} from 'react-redux';
import PayDialog from './PayDialog';
import {Action} from '../../../../../action-reducer/action';
import showPopup from '../../../../../standard-business/showPopup';
import helper from '../../../../../common/common';

const action = new Action(['fadada'], false);
const URL_PRICE = '/api/signature/account_management/enterprise_account_management/payOrder';//支付


const getSelfState = (state) => {
  return state.fadada || {};
};

const buildState = (config, items=[],title) => {
  return {
    ...config,
    items,
    title:`订单编号：${title}`,
    visible: true,
  };
};

const changeActionCreator = (key, value) => {
  return action.assign({[key]: value}, 'value');
};

const okActionCreator = () => async (dispatch, getState) => {
  const {items} = getSelfState(getState());
  const order = items[0].nativeOrderNo;
  const {result,returnCode,returnMsg} = await helper.fetchJson(`${URL_PRICE}/${order}`,'post');
  if(returnCode!=0){
    helper.showError(returnMsg);
    return
  }
  dispatch(action.assign({visible: false, ok: true}));
};

const closeActionCreator = () => (dispatch) => {
  dispatch(action.assign({visible: false, ok: false}));
};

const clickActionCreators = {
  ok: okActionCreator,
  close: closeActionCreator
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

export default async (config, items,title) => {

  const Container = connect(mapStateToProps, actionCreators)(PayDialog);
  global.store.dispatch(action.create(buildState(config, items,title)));
  await showPopup(Container, {}, true);

  const state = getSelfState(global.store.getState());
  global.store.dispatch(action.create({}));
  return state.ok;
};

