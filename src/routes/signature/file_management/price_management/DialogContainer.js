import {connect} from 'react-redux';
import Dialog from './Dialog';
import {Action} from '../../../../action-reducer/action';
import showPopup from '../../../../standard-business/showPopup';
import helper from '../../../../common/common';

const action = new Action(['temp'], false);


const getSelfState = (state) => {
  return state.temp || {};
};

const buildState = (config, items={}) => {
  return {
    ...config,
    items,
    title:'设置阶梯',
    visible: true,
    value: items
  };
};

const changeActionCreator = (key, keyValue) => (dispatch, getState) => {
  dispatch(action.assign({[key]: keyValue}, 'value'));
  const {value,controls} = getSelfState(getState());
  if(key === 'startPrice' || key === 'endPrice'){
    let rule = value.ruleBasicParameter ==  1 ? '文件份数':'订购金额';
    let startPrice = value.startPrice ? value.startPrice : '0';
    let endPrice = value.endPrice ? value.endPrice : '∞';
    let text1 = `${rule}: ${startPrice}~${endPrice}`;
    let text2 = `${rule} > ${startPrice} & ${rule} < ${endPrice}`;
    dispatch(action.assign({['ruleName']: text1}, 'value'));
    dispatch(action.assign({['ruleDescribe']: text2}, 'value'));
  }
};

const okActionCreator = () => async (dispatch, getState) => {
  const {value,controls} = getSelfState(getState());
  if (!helper.validValue(controls, value)) {
    dispatch(action.assign({valid: true}));
    return;
  }
  if(!value.startPrice && !value.endPrice){
    helper.showError('区间上限或区间下限必须其中填写一个');
    return
  }

  if(value.startPrice && value.endPrice && Number(value.startPrice) > Number(value.endPrice)){
    helper.showError('区间下限不能大于区间上限');
    return
  }
  dispatch(action.assign({visible: false, ok: [value]}));
};

const closeActionCreator = () => (dispatch) => {
  dispatch(action.assign({visible: false, ok: []}));
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

export default async (config, items) => {

  const Container = connect(mapStateToProps, actionCreators)(Dialog);
  global.store.dispatch(action.create(buildState(config, items)));
  await showPopup(Container, {}, true);

  const state = getSelfState(global.store.getState());
  global.store.dispatch(action.create({}));
  return state.ok;
};


