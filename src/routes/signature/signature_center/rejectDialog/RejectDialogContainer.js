import {connect} from 'react-redux';
import Reject from './Reject';
import {Action} from '../../../../action-reducer/action';
import showPopup from '../../../../standard-business/showPopup';
import helper, {fetchJson, postOption, showError} from '../../../../common/common';

const action = new Action(['fadada'], false);

const url = '/api/signature/signature_center/reject';

const getSelfState = (state) => {
  return state.fadada || {}
};

const buildState = (controls, id, closeFunc, item = {}) => {
  return {
    controls,
    title: '是否确认拒签',
    visible: true,
    value: item,
    id,
    closeFunc
  }
};

//输入值
const changeActionCreator = (key, value) => {
  if(typeof value !== 'object'){        //消除输入空格
    value = value.replace(/^\s|\s+$/g, "")
  }
  return action.assign({[key]: value}, 'value')
};

//确定
const okActionCreator = () => async(dispatch, getState) => {
  const {value, controls, id, closeFunc} = getSelfState(getState());
  if(!helper.validValue(controls, value)){
    dispatch(action.assign({valid: true}));
    return
  }
  value.id = id;
  const body = postOption(value);
  const {returnMsg, returnCode, result} = await fetchJson(url, body);
  if(returnCode !==0){return showError(returnMsg)}
  closeFunc && closeFunc();
  dispatch(action.assign({visible: false, ok: false}));
};

//关闭
const closeActionCreator = () => (dispatch) => {
  dispatch(action.assign({visible: false, ok: false}));
};

const clickActionCreator = {
  ok: okActionCreator,
  close: closeActionCreator
};

const toolActionCreator = (key) => {
  if(clickActionCreator.hasOwnProperty(key)){
    return clickActionCreator[key]();
  }else{
    return {type: 'unknown'}
  }
};

const exitValidActionCreator = () => {
  return action.assign({valid: false})
};

const mapStateToProps = (state) => {
  return getSelfState(state)
};

const actionCreator = {
  onClick: toolActionCreator,
  onChange: changeActionCreator,
  onExitValid: exitValidActionCreator
};

export default async (controls, items,title) => {
  const Containers = connect(mapStateToProps, actionCreator)(Reject);
  global.store.dispatch(action.create(buildState(controls, items,title)));
  await showPopup(Containers, {}, true);

  const state = getSelfState(global.store.getState());
  global.store.dispatch(action.create({}));
  return state.ok;
};
