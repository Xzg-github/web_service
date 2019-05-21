import {connect} from 'react-redux';
import AddDialog from './AddDialog';
import execWithLoading from '../../../../../standard-business/execWithLoading';
import {Action} from '../../../../../action-reducer/action';
import showPopup from '../../../../../standard-business/showPopup';
import helper from '../../../../../common/common';

const action = new Action(['temp'], false);
const URL_ACCUONT = '/api/signature/account_management/enterprise_account_management/personAccount';
const URL_UPDATE = '/api/signature/account_management/enterprise_account_management/addAuthl';

const getSelfState = (state) => {
  return state.temp || {};
};

const buildState = (controls, items,title,edit) => {
  let imgBase = '';
  if(edit){
    for(let word of controls[2].options){
      if(typeof items.signSealId == 'object' && items.signSealId.value === word.value){
        items.signSealId = word.value;
        imgBase = word.imgBase
      }
    }
  }

  return {
    controls,
    title,
    edit,
    visible: true,
    imgBase,
    value: {...items}
  };
};

const changeActionCreator = (key, value) =>  async (dispatch, getState) => {
  const {controls} = getSelfState(getState());
  if(key === 'userAccountId' && value){
    const {result,returnCode,returnMsg} = await helper.fetchJson(`${URL_ACCUONT}/${value.value}`)
    if(returnCode != 0){
      helper.showError(returnMsg);
      return
    }
    dispatch(action.assign({['account']: result.account}, 'value'));
  }else if(key === 'signSealId' && value){
    for(let item of controls[2].options){
      if(value === item.value){
        dispatch(action.assign({imgBase:item.imgBase}));
      }
    }
  }
  dispatch(action.assign({[key]: value}, 'value'));
};

const okActionCreator = () => async (dispatch, getState) => {
  const {value,controls,edit} = getSelfState(getState());
  if (!helper.validValue(controls, value)) {
    dispatch(action.assign({valid: true}));
    return;
  }
  execWithLoading(async()=> {
    const body = helper.postOption(helper.convert(value),!edit?'post':'put');
    const {result,returnCode,returnMsg} = await helper.fetchJson(URL_UPDATE,body)
    if(returnCode != 0){
      helper.showError(returnMsg);
      return
    }
    dispatch(action.assign({visible: false, ok: true}));
  });
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

const searchActionCreator = (key,keyValue,keyControl) => async(dispatch,getState) =>{
  const {controls} = getSelfState(getState());
  const json = await helper.fuzzySearchEx(keyValue,keyControl);
  if (!json.returnCode) {
    const index = controls.findIndex(item => item.key == key);
    const options = json.result;
    dispatch(action.update({options:options}, 'controls', index))
  }else {
    helper.showError(json.returnMsg)
  }
};

const actionCreators = {
  onChange: changeActionCreator,
  onSearch:searchActionCreator,
  onClick: clickActionCreator,
  onExitValid: exitValidActionCreator
};

export default async (controls, items,title,edit) => {
  const Container = connect(mapStateToProps, actionCreators)(AddDialog);
  global.store.dispatch(action.create(buildState(controls, items,title,edit)));
  await showPopup(Container, {}, true);

  const state = getSelfState(global.store.getState());
  global.store.dispatch(action.create({}));
  return state.ok;
};

