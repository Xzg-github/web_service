import { connect } from 'react-redux';
import {EnhanceLoading} from '../../../components/Enhance';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import helper, {postOption, showError} from '../../../common/common';
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
const payActionCreator =  async (dispatch, getState) => {
  const {value} = getSelfState(getState());
  if(!value.orderMoney){
    return showError('请填写订购金额！')
  }
  if(!value.companyName){
    return showError('客户名称不能为空')
  }
  value.companyAccountId = value.companyId;
  delete value.companyId;
  const {payConfig} = getParentState(getState());
  const URL_ORDER  = '/api/signature/business_account/order';
  const {returnCode, returnMsg, result } = await helper.fetchJson(URL_ORDER, helper.postOption(value));
  if(returnCode !== 0){return showError(returnMsg)}
  buildAddState(payConfig, [result], dispatch);
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

