import { connect } from 'react-redux';
import {EnhanceLoading} from '../../../components/Enhance';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import helper from '../../../common/common';
import EditPage from './EditPage';
import showPopup from '../../../standard-business/showPopup';
import AddDialogContainer, {buildAddState} from './AddDialog/AddDialogContainer';

const STATE_PATH =  ['business_account', 'edit'];
const PARENT_STATE_PATH = ['business_account'];
const action = new Action(STATE_PATH);

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH)
};

const getParentState = (rootState) => {
  return getPathValue(rootState, PARENT_STATE_PATH)
};

//输入值改变
const changeActionCreator = (key, value) => {
  return action.assign({[key]: value}, 'value');
};

//立即支付
const payActionCreator = (dispatch, getState) => {
  const {payConfig} = getParentState(getState());
  const item = [];
  buildAddState(payConfig, item, dispatch);
  showPopup(AddDialogContainer)
};
//关闭订购页签
const closeActionCreator = (dispatch, getState) => {
  const { activeKey, tabs } = getParentState(getState());
  const newTabs = tabs.filter(tab => tab.key !== activeKey);
  // 如果tab刚好是最后一个，则直接减一，
  if (activeKey !== 'index') {
    dispatch(action.assignParent({ tabs: newTabs, [activeKey]: undefined,activeKey: 'index'}));
  } else {
    dispatch(action.assign({}));
  }
};

const toolbarActions = {
  pay: payActionCreator,
  close: closeActionCreator
};

const clickActionCreator = (key) => {
  if(toolbarActions.hasOwnProperty(key)){
    return toolbarActions[key];
  }else{
    console.log('unknown key');
    return {type: 'unknown'}
  }
};

const mapStateToProps = (state) => {
  return getSelfState(state)
};

const actionCreator = {
  onChange: changeActionCreator,
  onClick: clickActionCreator
};

const Container = connect(mapStateToProps, actionCreator)(EditPage);
export default Container

