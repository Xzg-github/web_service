import {connect} from 'react-redux';
import AddDialog from './AddDialog';
import {Action} from '../../../../action-reducer/action';
import showPopup from '../../../../standard-business/showPopup';
import helper from '../../../../common/common';

const action = new Action(['temp'], false);


const url = '/api/signature/signature_center/authentication';

const getSelfState = (state) => {
  return state.temp || {};
};

const buildState = (controls, items={}) => {
  return {
    controls,
    title:'发起认证',
    visible: true,
    value: items
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
  const {result,returnCode,returnMsg} =await helper.fetchJson(url,body);
  if(returnCode !== 0) {
    helper.showError(returnMsg);
    return
  }
  window.open(result);
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

export default async (controls, items,title) => {

  const Container = connect(mapStateToProps, actionCreators)(AddDialog);
  global.store.dispatch(action.create(buildState(controls, items,title)));
  await showPopup(Container, {}, true);

  const state = getSelfState(global.store.getState());
  global.store.dispatch(action.create({}));
  return state.ok;
};

