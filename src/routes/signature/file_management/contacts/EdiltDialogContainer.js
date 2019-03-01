import {connect} from 'react-redux';
import EditDialog from './EditDialog';
import {Action} from '../../../../action-reducer/action';
import showPopup from '../../../../standard-business/showPopup';
import helper from '../../../../common/common';
import {toFormValue} from '../../../../common/check';

const action = new Action(['temp'], false);

const URL_ADD = '/api/signature/file_management/contacts/addPerson';

const getSelfState = (state) => {
  return state.temp || {};
};

const buildState = (config, items,edit) => {
  return {
    ...config,
    title: edit ? '编辑' : '新增',
    visible: true,
    value: items,
    edit
  };
};

const changeActionCreator = (key, value) => {
  return action.assign({[key]: value}, 'value');
};

const okActionCreator = () => async (dispatch, getState) => {
  const state = getSelfState(getState());
  if (!helper.validValue(state.controls, state.value)) {
    dispatch(action.assign({valid: true}));
    return;
  }
  const body = helper.postOption(helper.convert(state.value),state.edit?'put':'post');
  const {result,returnCode,returnMsg} = await helper.fetchJson(URL_ADD,body);
  if(returnCode !== 0 ){
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

export default async (config, items={},edit=false) => {
  const Container = connect(mapStateToProps, actionCreators)(EditDialog);
  global.store.dispatch(action.create(buildState(config, items,edit)));
  await showPopup(Container, {}, true);

  const state = getSelfState(global.store.getState());
  global.store.dispatch(action.create({}));
  return state.ok;
};

