import { connect } from 'react-redux';
import {EnhanceLoading} from '../../../../components/Enhance';
import {Action} from '../../../../action-reducer/action';
import {getPathValue} from '../../../../action-reducer/helper';
import helper from '../../../../common/common';
import EditPage from './EditPage';

const STATE_PATH =  ['price_management'];
const action = new Action(STATE_PATH);


const getSelfState = (rootState) => {
  const parent = getPathValue(rootState, STATE_PATH);
  return parent[parent.activeKey];
};

const initActionCreator = () => async (dispatch, getState) => {
  const {editConfig} = getPathValue(getState(), STATE_PATH);
  const {tabKey,id} = getSelfState(getState());
  dispatch(action.assign({status: 'loading'}, tabKey));
  try {


    dispatch(action.assign({
      ...editConfig,
      value:{},
      tableItems: [],
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

export default connect(mapStateToProps, actionCreators)(EnhanceLoading(EditPage));
