import { connect } from 'react-redux';
import { Action } from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {buildOrderTabPageState} from './OrderTabPageContainer';
import { EnhanceLoading } from '../../../components/Enhance';
import Signature from './Signature';

const STATE_PATH = ['signature_center'];
const action = new Action(STATE_PATH);
const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const initActionCreator = () => async(dispatch) => {
  dispatch(action.assign({status: 'loading'}));
  const state = await buildOrderTabPageState();
  if(!state){
    dispatch(action.assign({status: 'retry'}));
    return;
  }
  dispatch(action.create(state))
};

//Tab切换
const tabChangeActionCreator = (key) => {
  return action.assign({activeKey: key})
};

//Tab页签关闭
const tabCloseActionCreator = (key) => (dispatch, getState) => {
  const { activeKey, tabs } = getSelfState(getState());
  const newTabs = tabs.filter(tab => tab.key !== key );
  let index = tabs.findIndex(tab => tab.key === key);
  (newTabs.length === index) && (index--);
  if (key !== 'index') {
    dispatch(action.assign({ tabs: newTabs, [key]: undefined, activeKey: newTabs[index].key}));
  } else {
    dispatch(action.assign({}));
  }
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onInit: initActionCreator,
  onTabChange: tabChangeActionCreator,
  onTabClose: tabCloseActionCreator,
};

const RootContainer = connect(mapStateToProps, actionCreators)(EnhanceLoading(Signature));
export default RootContainer
