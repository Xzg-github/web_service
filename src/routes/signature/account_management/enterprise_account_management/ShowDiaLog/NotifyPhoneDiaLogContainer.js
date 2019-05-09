import {connect} from 'react-redux';
import Dialog from './Dialog';
import {Action} from '../../../../../action-reducer/action';
import showPopup from '../../../../../standard-business/showPopup';
import helper from '../../../../../common/common';

const action = new Action(['temp'], false);

const URL_PHONE = '/api/signature/account_management/enterprise_account_management/updatePhone';

const getSelfState = (state) => {
  return state.temp || {};
};

const buildState = (controls, result) => {
  return {
    controls,
    title:'修改手机号',
    visible: true,
    value: result,
    width:300
  };
};

const changeActionCreator = (key, value) => {
  return action.assign({[key]: value}, 'value');
};

const checkPhone= (phone) => {
  if(!(/^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/.test(phone))){
    return false;
  }else {
    return true
  }
};

const checkMail= (mail) => {
  if(!(/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(mail))){
    return false;
  }else {
    return true
  }
};

const okActionCreator = () => async (dispatch, getState) => {
  const {value,controls,edit} = getSelfState(getState());
  if (!helper.validValue(controls, value)) {
    dispatch(action.assign({valid: true}));
    return;
  }
  if(value.notifyPhone){
    if(!checkPhone(value.notifyPhone)){
      helper.showError('手机号码格式不正确')
      return
    }
  }else if(value.notifyEmail){
    if(!checkMail(value.notifyEmail)){
      helper.showError('邮箱格式不正确')
      return
    }
  }


  const body = helper.postOption(helper.convert(value));
  const {result,returnCode,returnMsg} = await helper.fetchJson(URL_PHONE,body);
  if(returnCode != 0){
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

export default async (controls, items) => {
  const Container = connect(mapStateToProps, actionCreators)(Dialog);
  global.store.dispatch(action.create(buildState(controls, items)));
  await showPopup(Container, {}, true);

  const state = getSelfState(global.store.getState());
  global.store.dispatch(action.create({}));
  return state.ok;
};

