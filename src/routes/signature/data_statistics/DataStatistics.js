import { connect } from 'react-redux';
import { Action } from '../../../action-reducer/action';
import { EnhanceLoading } from '../../../components/Enhance';
import helper from '../../../common/common';
import {getPathValue} from '../../../action-reducer/helper';
import {buildOrderPageState} from '../../../common/state';
import createTabPage from '../../../standard-business/createTabPage';
import OrderPageContainer from './OrderPageContainer';
import ShowContainer from './ShowContainer';

const STATE_PATH = ['data_statistics'];
const URL_CONFIG = '/api/signature/data_statistics/config';
const URL_LIST  = '/api/signature/data_statistics/data';

const action = new Action(STATE_PATH);
const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

//初始化
const initActionCreator = () => async (dispatch) => {
  try{
    dispatch(action.assign({status: 'loading'}));
    const {index, total, file, identity, sms} =  helper.getJsonResult(await helper.fetchJson(URL_CONFIG));
    const result = helper.getJsonResult(await helper.fetchJson(URL_LIST));
    const other = {
      tabs: [{key: 'index', title: '数据列表', close: false}],
      activeKey: 'index',
      currentPage: 1,
      searchData: {},
      status: 'page',
      totalConfig: total,
      fileConfig: file,
      identityConfig: identity,
      smsConfig: sms
    };
    const payload = buildOrderPageState(result, index, other);
    dispatch(action.create(payload));
  }catch (e){
    helper.showError(e.message);
    dispatch(action.assign({status: 'retry'}));
  }
};

//Tab页切换
const tabChangeActionCreator = (key) => {
  return action.assign({activeKey: key})
};

//Tab页签关闭
const tabCloseActionCreator = (key) => (dispatch, getState) => {
  const { activeKey, tabs } = getSelfState(getState());
  const newTabs = tabs.filter(tab => tab.key !== key );
  let index = tabs.findIndex(tab => tab.key === key);
  // 如果tab刚好是最后一个，则直接减一，
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

const getComponent = (activeKey) => {
  if(activeKey === 'index'){
    return OrderPageContainer;
  }else {
    return ShowContainer;
  }
};

const DataStatistics = connect(mapStateToProps, actionCreators)(EnhanceLoading(createTabPage(getComponent)));
export default DataStatistics;

