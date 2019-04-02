import { connect } from 'react-redux';
import { Action } from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import helper from '../../../common/common';
import {search} from '../../../common/search';
import {buildOrderPageState} from '../../../common/state';
import {createCommonTabPage} from "../../../standard-business/createTabPage/index";
import {EnhanceLoading} from '../../../components/Enhance';
import OrderContainer from './OrderContainer';
import EditPageContainer from './EditPageContainer'

const STATE_PATH = ['business_account'];
const action = new Action(STATE_PATH);

const URL_CONFIG = '/api/signature/business_account/config';
const URL_LIST  = '/api/signature/business_account/list';

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH)
};

//初始化
const initActionCreator = () => async (dispatch) => {
  try{
    dispatch(action.assign({status: 'loading'}));
    const {index, edit, credits, viewQuota, pay} = helper.getJsonResult(await helper.fetchJson(URL_CONFIG));
    const list = helper.getJsonResult(await search(URL_LIST, 0, index.pageSize, {}));
    const other = {
      tabs: [{key: 'index', title: '企业账户列表', close: false}],
      activeKey: 'index',
      currentPage: 1,
      searchData: {},
      status: 'page',
      editConfig: edit,
      creditSettingConfig: credits,
      viewQuotaConfig: viewQuota,
      payConfig: pay
    };
    const payload = buildOrderPageState(list, index, other);
    dispatch(action.create(payload));
  }catch(e){
    helper.showError(e.message);
    dispatch(action.assign({status: 'retry'}))
  }
};

//Tab页签关闭
const tabCloseActionCreator = (key) => (dispatch, getState) => {
  const { tabs, activeKey } = getSelfState(getState());
  const newTabs = tabs.filter(tab => tab.key !== key);
  if (activeKey === key) {
    let index = tabs.findIndex(tab => tab.key === key);
    (newTabs.length === index) && (index--);
    dispatch(action.assign({tabs: newTabs, [activeKey]: undefined, activeKey: newTabs[index].key}));
  } else{
    dispatch(action.assign({tabs: newTabs, [key]: undefined}));
  }
};

//tab页切换
const tabChangeActionCreator = (key) => {
  return action.assign({activeKey: key})
};

const mapStateToProps = (state) => {
  return getSelfState(state)
};

const actionCreators = {
  onInit: initActionCreator,
  onTabChange: tabChangeActionCreator,
  onTabClose: tabCloseActionCreator,
};


const BusinessAccount = connect(mapStateToProps, actionCreators)(EnhanceLoading(createCommonTabPage(OrderContainer, EditPageContainer)));
export default BusinessAccount;
