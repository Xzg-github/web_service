import { connect } from 'react-redux';
import helper from '../../common/common';
import {Action} from '../../action-reducer/action';
import {getPathValue} from '../../action-reducer/helper';
import {EnhanceLoading} from '../../components/Enhance';
import Page from './Page';
import execWithLoading from '../../standard-business/execWithLoading';


const STATE_PATH = ['registered'];
const action = new Action(STATE_PATH);
const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const URL_CONFIG = '/api/registered/config';
const URL_SEND_CODE = '/api/registered/code';
const URL_SET_NEWPSW = '/api/registered/personal';    //个人注册
const URL_COMPANY = '/api/registered/company';       //企业注册

//初始化
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

//发送验证码
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
  const params = {
    type: activeKey === 'phoneNumber' ? 'phoneNumber' : 'email'? 'email': 'companyEmail',
    recipient: value[activeKey]
  };
  const {returnCode, result, returnMsg} = await helper.fetchJson(URL_SEND_CODE, helper.postOption(params));
  if(returnCode !== 0) return helper.showError(returnMsg);
  dispatch(action.assign({varifyId: result}));
};

//输入值
const changeActionCreator = (key, value) => action.assign({[key]: value}, 'value');

//Tab切换
const onTabChangeActionCreator = (activeKey) => action.assign({activeKey, value: ''});

//验证器
const validator = (state) => {
  const {activeKey, value, validateRules} = state;
  const valid = (key, rule, msg) => {
    const flag = value[key] && new RegExp(rule, 'g').test(value[key].replace(/^\s+|\s+$/g,''));
    if(!flag) helper.showError(msg);
    return flag;
  };
  return valid(activeKey, validateRules[activeKey].rule, validateRules[activeKey].msg)
};

let varifyCodeDOM = {}, varifyKey = '';
//提交
const okActionCreator = (key) => async (dispatch, getState) => {
  const {value, activeKey, varifyId='', timer} = getSelfState(getState());
  if(!validator(getSelfState(getState()))) return;
/*  if(!value[varifyKey] || !varifyCodeDOM[varifyKey].validate(value[varifyKey])) {
    return helper.showError('验证码错误！')
  }*/
  if(timer === 0) return helper.showError('请重新发送验证码');
  execWithLoading( async() => {
    const params = {
      registerType: activeKey === 'phoneNumber' ? 'phone_number' : 'email'? 'email': 'companyEmail',
      accountPassword: value.accountPassword,
      phoneNumber: value.phoneNumber,
      email:value.email,
      verifyCode: value[`${activeKey}_code`],
      belongCompanyCode: value.belongCompanyCode,
      belongCompanyName: value.belongCompanyName,
      companyName: value.companyName,
      contactName: value.contactName,
      contactPhone: value.contactPhone,
      companyEmail: value.companyEmail,
    };
    const {returnCode, result, returnMsg} = await helper.fetchJson(activeKey === 'companyEmail'? URL_COMPANY:URL_SET_NEWPSW, helper.postOption(params));debugger
    if (returnCode === 0) {
      helper.showSuccessMsg('注册成功，返回登录页进行登录');
      dispatch(action.assign({value: {}}));
    }else {
      helper.showError(returnMsg);
    }
    dispatch(action.assign({value: {}}));
    setTimeout(() => window.location.href = '/login', 500);
  });
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreator = {
  onInit: initActionCreator,
  onChange:changeActionCreator,
  onTabChange: onTabChangeActionCreator,
  onClick: okActionCreator,
  sendVarifyCode
};

const Component = EnhanceLoading(Page);
const Container = connect(mapStateToProps, actionCreator)(Component);

export default Container
