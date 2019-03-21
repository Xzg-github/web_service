import {connect} from 'react-redux';
import LookDialog from './LookDialog';
import {Action} from '../../../../../action-reducer/action';
import showPopup from '../../../../../standard-business/showPopup';
import helper from '../../../../../common/common';

const action = new Action(['temp'], false);


const getSelfState = (state) => {
  return state.temp || {};
};

const buildState = (config, value={}) => {
  let newItems;
  if(value.detailResponses && value.detailResponses.length > 10){
    newItems = value.slice(0,10)
  }else {
    newItems = value.detailResponses ? value.detailResponses : [];
  }

  return {
    ...config,
    tableItems1:value.balanceResponses ? value.balanceResponses:[],
    tableItems2:newItems,
    items:value.detailResponses,
    title:'查看消费记录',
    visible: true,
    value
  };
};

const changeActionCreator = (key, value) => {
  return action.assign({[key]: value}, 'value');
};


const cancelActionCreator = (key, value) => {
  return action.assign({visible: false, ok: false});
};


const okActionCreator = () => async (dispatch, getState) => {

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


const onMoreActionCreator = () => (dispatch,getState) => {
  const {items,tableItems2} = getSelfState(getState());
  let newItems = items.slice(0,tableItems2.length+10);
  dispatch(action.assign({tableItems2: newItems}));
};



const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onChange: changeActionCreator,
  onClick: clickActionCreator,
  onCancel:cancelActionCreator,
  onMore:onMoreActionCreator,
};

export default async (config, value) => {

  const Container = connect(mapStateToProps, actionCreators)(LookDialog);
  global.store.dispatch(action.create(buildState(config, value)));
  await showPopup(Container, {}, true);

  const state = getSelfState(global.store.getState());
  global.store.dispatch(action.create({}));
  return state.ok;
};

