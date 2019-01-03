import { connect } from 'react-redux';
import Page from './Page';
import {EnhanceLoading} from '../../../components/Enhance';
import helper from '../../../common/common';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import Gverify from '../../../common/gVerify'
import execWithLoading from '../../../standard-business/execWithLoading';

const STATE_PATH = ['password', 'find'];
const action = new Action(STATE_PATH);
const URL_CONFIG = '/api/password/config';
const URL_SEND_CODE = '/api/password/sendCode';
const URL_SET_NEWPSW = '/api/password/reset';

let varifyCodeDOM = {}, varifyKey = '';

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const initActionCreator = () => async (dispatch) => {
  try {
    dispatch(action.assign({status: 'loading'}));
    const config = helper.getJsonResult(await helper.fetchJson(URL_CONFIG));
    const payload = {...config, value: {}, loading: false, status: 'page'};
    dispatch(action.create(payload));
  } catch (e) {
    helper.showError(e.message);
    dispatch(action.assign({status: 'retry'}));
  }
};

const changeActionCreator = (key, value) => action.assign({[key]: value}, 'value');

const onTabChangeActionCreator = (activeKey) => action.assign({activeKey, changeVerifyFlag: true});

const validator = (state) => {
  const {current, activeKey, value, validateRules} = state;
  const valid = (key, rule, msg) => {
    const flag = value[key] && new RegExp(rule, 'g').test(value[key].replace(/^\s+|\s+$/g,''));
    if(!flag) helper.showError(msg);
    return flag;
  };
  switch (current) {
    case 0: return valid(activeKey, validateRules[activeKey].rule, validateRules[activeKey].msg);
    // case 1: return valid(`${activeKey}_code`, validateRules[activeKey].rule, validateRules[activeKey].msg);
    case 2:
      const flag = valid(`newPwd_${activeKey}`, validateRules['newPwd_'].rule, validateRules['newPwd_'].msg);
      const isSame = value[`newPwd_${activeKey}`] === value[`newPwdAgin_${activeKey}`];
      if(flag && !isSame) helper.showError('请输入和上面相同的密码');
      return flag && isSame;
    default: return true;
  }
};

const okActionCreator = async (dispatch, getState) => {
    execWithLoading(async () => {
      const {value, activeKey, varifyId=''} = getSelfState(getState());
      const params = {
        type: activeKey === 'mobile' ? 'phone' : activeKey,
        id: varifyId,
        password: value[`newPwdAgin_${activeKey}`],
        recipient: value[activeKey],
        text: value[`${activeKey}_code`]
      };
      const {returnCode, result, returnMsg} = await helper.fetchJson(URL_SET_NEWPSW, helper.postOption(params));
      if (returnCode === 0) {
        helper.showSuccessMsg('密码修改成功');
        dispatch(action.assign({value: {}}));
      }else {
        helper.showError(returnMsg);
      }
      dispatch(action.assign({value: {}}));
      setTimeout(() => window.location.href = '/login', 500);
    });
};

const firstNext = async (dispatch, getState) => {
  const {value, current} = getSelfState(getState());
  if(!value[varifyKey] || !varifyCodeDOM[varifyKey].validate(value[varifyKey])) {
    return helper.showError('验证码错误！')
  }
  dispatch(action.assign({current: current+1}));
};

const secondNext = async (dispatch, getState) => {
  const {current, timer} = getSelfState(getState());
  if(timer === 0) return helper.showError('请重新发送验证码');
  dispatch(action.assign({current: current+1, timer: null}));
};

const clickActionCreator = (key, current) => async (dispatch, getState) => {
  if (current < 0 || current > 2) {
    console.log('unknown key:', key);
    return {type: 'unknown'};
  }
  if(!validator(getSelfState(getState()))) return;
  switch (current) {
    case 0: return firstNext(dispatch, getState);
    case 1: return secondNext(dispatch, getState);
    case 2: return okActionCreator(dispatch, getState);
  }
};

const onChangeAccount = () => action.assign({current: 0, changeVerifyFlag: true, timer: null});

const didMountCallback = () => async (dispatch, getState) => {
  const {current, activeKey} = getSelfState(getState());
  if(current === 0){
    varifyKey = `varifyCode_${activeKey}`;
    varifyCodeDOM[varifyKey]= new Gverify(varifyKey);
    dispatch(action.assign({changeVerifyFlag: false}));
  }
};

const sendVarifyCode = () => async (dispatch, getState) => {
  const {activeKey, timer, value} = getSelfState(getState());
  if(timer) return;
  let t = 60;
  dispatch(action.assign({timer: t}));
  const T = setInterval(()=>{
    t <= 0 && clearInterval(T);
    t > 0 && t--;
    dispatch(action.assign({timer: t}));
  }, 1000);
  const params = {type: activeKey === 'mobile' ? 'phone' : activeKey, recipient: value[activeKey]};
  const {returnCode, result, returnMsg} = await helper.fetchJson(URL_SEND_CODE, helper.postOption(params));
  if(returnCode !== 0) return helper.showError(returnMsg);
  dispatch(action.assign({varifyId: result}));
};

const actionCreators = {
  onInit: initActionCreator,
  onChange: changeActionCreator,
  onTabChange: onTabChangeActionCreator,
  onClick: clickActionCreator,
  onChangeAccount,
  didMountCallback,
  sendVarifyCode
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const Component = EnhanceLoading(Page);
const Container = connect(mapStateToProps, actionCreators)(Component);
export default Container;

