import { connect } from 'react-redux';
import {EnhanceLoading} from '../../../components/Enhance';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import helper from '../../../common/common';
import LookBillPage from './LookBillPage';

const STATE_PATH =  ['monthly_bill'];
const action = new Action(STATE_PATH);

const URL_ID = '/api/signature/monthly_bill/getId'; //根据ID获取月账单

const getSelfState = (rootState) => {
  const parent = getPathValue(rootState, STATE_PATH);
  return parent[parent.activeKey];
};

const initActionCreator = () => async (dispatch, getState) => {
  const {editConfig} = getPathValue(getState(), STATE_PATH);
  const {tabKey,id} = getSelfState(getState());
  dispatch(action.assign({status: 'loading'}, tabKey));
  try {
    const result = helper.getJsonResult(await helper.fetchJson(`${URL_ID}/${id}`));
    dispatch(action.assign({
      ...editConfig,
      value:result,
      tableItems: result.detailList? result.detailList : [],
      status: 'page',
      options: {},
    }, tabKey));


  } catch (e) {
    helper.showError(e.message);
    dispatch(action.assign({status: 'retry'}, tabKey));
  }
};


const closeActionCreator = (props) => () => {
  props.onTabClose(props.tabKey);
};




const toolbarActions = {
  close: closeActionCreator,
};

const clickActionCreator = (props, key) => {
  if (toolbarActions.hasOwnProperty(key)) {
    return toolbarActions[key](props);
  } else {
    return {type: 'unknown'};
  }
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onInit: initActionCreator,
  onClick: clickActionCreator,
};

export default connect(mapStateToProps, actionCreators)(EnhanceLoading(LookBillPage));
