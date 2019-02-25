import {connect} from 'react-redux';
import Dialog from './Dialog';
import {Action} from '../../../../../action-reducer/action';
import showPopup from '../../../../../standard-business/showPopup';
import helper from '../../../../../common/common';

const action = new Action(['temp'], false);
const URL_MODIFY = '/api/signature/account_management/personal_account_management/modify';

const getSelfState = (state) => {
  return state.temp || {};
};

const buildState = (config, items) => {
  return {
    ...config,
    items,
    visible: true,
    value: {}
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
  const body = helper.postOption(value);
  const {result,returnCode,returnMsg} =await helper.fetchJson(URL_MODIFY,body);
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

export default async (config, items) => {

  const Container = connect(mapStateToProps, actionCreators)(Dialog);
  global.store.dispatch(action.create(buildState(config, items)));
  await showPopup(Container, {}, true);

  const state = getSelfState(global.store.getState());
  global.store.dispatch(action.create({}));
  return state.ok;
};


