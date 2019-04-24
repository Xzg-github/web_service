import {connect} from 'react-redux';
import OrderDialog from './OrderDialog';
import {Action} from '../../../../../action-reducer/action';
import showPopup from '../../../../../standard-business/showPopup';
import helper from '../../../../../common/common';
import showPayDiaLog from './PayDialogContainer';

const action = new Action(['temp'], false);

const URL_ADD = '/api/signature/account_management/enterprise_account_management/addOrder';//获取价格明细

const getSelfState = (state) => {
  return state.temp || {};
};

const buildState = (config, items=[],pay) => {
  return {
    ...config,
    items,
    title:'订购',
    visible: true,
    value: {},
    pay,
    validForm:false
  };
};

const changeActionCreator = (key, value) =>  (dispatch, getState) => {
  const {items} = getSelfState(getState());
  if(typeof value !== 'object'){
    value = value.replace(/^\s+|\s+$/g,"")
  }
  let isMoney = false;
  for(let item of items){
    let money = Number(value);
    let start = typeof(item.startPrice)!== 'number' ? 0 : Number(item.startPrice);
    let end = typeof (item.endPrice) !== 'number' ? Number.MAX_VALUE :Number(item.endPrice);
    if(money >= start && money < end){
      isMoney = true;
    }
  }
  if(!isMoney){
    dispatch(action.assign({validForm:true}));
  }else {
    dispatch(action.assign({validForm:false}));
  }
  dispatch(action.assign({[key]: value}, 'value'));
};

const okActionCreator = () => async (dispatch, getState) => {
  const {value,controls,items,pay} = getSelfState(getState());
  if (!helper.validValue(controls, value)) {
    dispatch(action.assign({valid: true}));
    return;
  }
  let isMoney = false;
  for(let item of items){
    let money = Number(value.orderMoney);
    let start = typeof(item.startPrice)!== 'number' ? 0 : Number(item.startPrice);
    let end = typeof (item.endPrice) !== 'number' ? Number.MAX_VALUE :Number(item.endPrice);
    if(money >= start && money <= end){
      isMoney = true;
      value.unitPrice = item.price;
    }
  }
  if(!isMoney){
    dispatch(action.assign({validForm:true}));
    return
  }
  const {result,returnCode,returnMsg} = await helper.fetchJson(URL_ADD,helper.postOption(value));
  if(returnCode!==0){
    helper.showError(returnMsg);
    return
  }
  // result.number = Math.floor(result.orderMoney/result.unitPrice);
  // const res = await showPayDiaLog(pay,[result],result.nativeOrderNo);

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


const URL_ITEMS = '/api/signature/account_management/enterprise_account_management/rule';//获取价格明细
export default async (config,pay) => {
  try {
    const Container = connect(mapStateToProps, actionCreators)(OrderDialog);
    const items = helper.getJsonResult(await helper.fetchJson(URL_ITEMS));
    global.store.dispatch(action.create(buildState(config, items,pay)));
    await showPopup(Container, {}, true);
    const state = getSelfState(global.store.getState());
    global.store.dispatch(action.create({}));
    return state.ok;
  }catch (e){
    helper.showError(e.message)
  }

};

