import {connect} from 'react-redux';
import {Action} from "../../../../action-reducer/action";
import showPopup from '../../../../standard-business/showPopup';
import helper, {postOption} from '../../../../common/common';
import {updateTable} from "./RootContainer";
import Untied from './Untied'

const action = new Action(['temp'], false);
const URL_UNTIED = '/api/signature/company_file_management/worker/untied';

const getSelfState = (state) => {
  return state.temp || {}
};

const buildState = (controls, items,) => {
  return {
    controls,
    title: '是否确定解绑',
    visible: true,
    items,
    value: {}
  }
};

const okActionCreator = () => async(dispatch, getState) => {
  const {value, items, controls} = getSelfState(getState());
  const id = items[0].id;
  if (!helper.validValue(controls, value)) {
    dispatch(action.assign({valid: true}));
    return;
  }
  const {returnMsg, returnCode, result} = await helper.fetchJson(URL_UNTIED, postOption({...value,companyAuditState:4, id}));
  if(returnCode !==0){return helper.showError(returnMsg)}
  helper.showSuccessMsg(returnMsg);
  dispatch(action.assign({visible: false, ok: false}));
  return updateTable(dispatch, getState)
};

const closeActionCreator = () => (dispatch) => {
  dispatch(action.assign({visible: false, ok: false}))
};

const changeActionCreator = (key, value) => {
  if(typeof value !== 'object'){        //消除输入空格
    value = value.replace(/^\s|\s+$/g, "")
  }
  return action.assign({[key]: value}, 'value')
};

const clickActionCreator = {
  ok: okActionCreator,
  close: closeActionCreator
};

const toolActionCreator = (key) => {
  if(clickActionCreator.hasOwnProperty(key)){
    return clickActionCreator[key]()
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
  onExitValid: exitValidActionCreator,
  onChange: changeActionCreator
};

export default async(controls, items) => {
  const Container = connect(mapStateToProps, actionCreator)(Untied);
  global.store.dispatch(action.create(buildState(controls, items,)));
  await showPopup(Container, {}, true);

  const state = getSelfState(global.store.getState());
  global.store.dispatch(action.create({}));
  return state.ok;
}
