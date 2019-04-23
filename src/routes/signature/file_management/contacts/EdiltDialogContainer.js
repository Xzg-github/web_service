import {connect} from 'react-redux';
import EditDialog from './EditDialog';
import {Action} from '../../../../action-reducer/action';
import showPopup from '../../../../standard-business/showPopup';
import helper from '../../../../common/common';
import {toFormValue} from '../../../../common/check';
import execWithLoading from '../../../../standard-business/execWithLoading';

const action = new Action(['temp'], false);

const URL_ADD = '/api/signature/file_management/contacts/addPerson';
const URL_DROP = '/api/signature/file_management/contacts/dropGroup'; //分组下拉

const getSelfState = (state) => {
  return state.temp || {};
};

const buildState = (config, items,edit) => {
  const controls = helper.deepCopy(config.controls);
  return {
    ...config,
    controls,
    title: edit ? '编辑' : '新增',
    visible: true,
    value: items,
    edit
  };
};

const changeActionCreator = (key, value) => {
  if(typeof value !== 'object'){
    value = value.replace(/^\s+|\s+$/g,"")
  }
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
  const state = getSelfState(getState());
  if (!helper.validValue(state.controls, state.value)) {
    dispatch(action.assign({valid: true}));
    return;
  }
  if(state.value.companyContactPhoneNumber &&!checkPhone(state.value.companyContactPhoneNumber)){
    helper.showError('手机号码格式不正确')
    return
  }
  if(state.value.companyContactAccount && !checkMail(state.value.companyContactAccount)){
    helper.showError('账号格式不正确')
    return
  }
  const body = helper.postOption(helper.convert(state.value),state.edit?'put':'post');
  execWithLoading( async() => {
    const {result,returnCode,returnMsg} = await helper.fetchJson(URL_ADD,body);
    if(returnCode !== 0 ){
      helper.showError(returnMsg);
      return
    }
    dispatch(action.assign({visible: false, ok: true}));
  })
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

const onSearchActionCreator = (key, title) => async (dispatch, getState) => {
  const {controls} = getSelfState(getState());
  let data, options, body;
  switch (key) {
    case 'companyContactGroupId': {

      data = await helper.fetchJson(URL_DROP);
      if (data.returnCode != 0) {
        return;
      }
      break;
    }
    default:
      return;
  }
  options = data.result ;
  const index = controls.findIndex(item => item.key == key);
  dispatch(action.update({options}, 'controls', index));
};


const actionCreators = {
  onChange: changeActionCreator,
  onClick: clickActionCreator,
  onSearch:onSearchActionCreator,
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

