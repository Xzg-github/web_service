import {connect} from 'react-redux';
import EditDialog from './EditDialog';
import {Action} from '../../../../action-reducer/action';
import showPopup from '../../../../standard-business/showPopup';
import helper, {postOption, showError, validValue, fetchJson} from '../../../../common/common';

const action = new Action(['businessProject'], false);
const URL_ADD =  '/api/signature/file_management/businessProject/add';

const getSelfState = (state) => {
  return state.businessProject || {};
};

const buildState = (config, items,edit) => {
  return {
    ...config,
    title: edit ? '编辑' : '新增',
    visible: true,
    value: items
  };
};

const changeActionCreator = (key, value) => {
  return action.assign({[key]: value}, 'value');
};

const okActionCreator = () => async (dispatch, getState) => {
  const {value, controls} = getSelfState(getState());
  if(!validValue(controls, value)){
    dispatch(action.assign({valid: true}));
    return;
  }
  const {returnCode, returnMsg} = await fetchJson(URL_ADD, postOption(value, 'post'));
  if(returnCode !== 0){
    showError(returnMsg);
    return
  }
  helper.showSuccessMsg('保存成功');
  dispatch(action.assign({visible: false, ok: false}));
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

