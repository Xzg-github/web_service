import {connect} from 'react-redux';
import Reason from './Reason';
import {Action} from '../../../../../action-reducer/action';
import showPopup from '../../../../../standard-business/showPopup';
import helper, {showError, showSuccessMsg} from '../../../../../common/common';

const action = new Action( ['fadada'], false);
const action1 = new Action( ['temp'], false);
const URL_REJECT = `/api/signature/signature_center/repeal`;

const getSelfState = (state) => {
  return state.fadada || {}
};

const buildState = (controls, close, id, item ={}) => {
  return {
    controls,
    close,
    title: '是否确定撤销',
    value: item,
    visible: true,
    id
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
const okActionCreator = () => async (dispatch, getState) => {
  const {value, controls, close, id} = getSelfState(getState());
  if(!helper.validValue(controls, value)){
    dispatch(action.assign({valid: true}));
    return
  }
  value.id = id;
  const {returnMsg, returnCode, result} = await helper.fetchJson(URL_REJECT, helper.postOption(value));
  if(returnCode !== 0){return showError(returnMsg)}
  showSuccessMsg(returnMsg);
  dispatch(action.assign({visible: false, ok: true}));
  dispatch(action1.assign({visible: false}))
  close();
};

//关闭
const closeActionCreator = () => (dispatch) => {
  dispatch(action.assign({visible: false, ok: false}))
};

const clickActionCreator = {
  ok: okActionCreator,
  close: closeActionCreator
};

const toolActionCreator = (key) => {
  if(clickActionCreator.hasOwnProperty(key)){
    return clickActionCreator[key]()
  }else{
    return(type: 'unknown')
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

export default async(controls, items, title) => {
  const Containers = connect(mapStateToProps, actionCreator)(Reason);
  global.store.dispatch(action.create(buildState(controls, items, title)));
  await showPopup(Containers, {}, true);

  const state = getSelfState(global.store.getState());
  global.store.dispatch(action.create({}));
  return state.ok;
}
