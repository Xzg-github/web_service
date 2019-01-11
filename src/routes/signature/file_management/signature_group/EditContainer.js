import { connect } from 'react-redux';
import {EnhanceLoading} from '../../../../components/Enhance';
import {Action} from '../../../../action-reducer/action';
import {getPathValue} from '../../../../action-reducer/helper';
import helper from '../../../../common/common';
import EditPage from './EditPage';
import showStaffDialog from '../../enterprise_documents/StaffDialogContainer'

const STATE_PATH =  ['signature_group'];
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
    const tableItems = [
      {a:1},
      {a:2},
      {a:3},
      {a:4},
      {a:5},
    ];

    dispatch(action.assign({
      ...editConfig,
      value:{},
      tableItems,
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

const swapItems = (arr, index1, index2) => {
  if(index2  >= arr.length){
    index2 = 0
  }
  arr[index1] = arr.splice(index2, 1, arr[index1])[0];
  return arr;
};

const upwardActionCreator = (props) => (dispatch,getState) => {
  const {tableItems} = props;
  const {tabKey,id} = getSelfState(getState());
  const index = helper.findOnlyCheckedIndex(tableItems);
  if(index === -1){
    helper.showError('请勾选一条记录');
    return
  }
  const items = helper.deepCopy(tableItems);
  const newItems = swapItems(items,index,index-1);
  dispatch(action.assign({tableItems: newItems}, tabKey))

};

const downActionCreator = (props) => (dispatch,getState) => {
  const {tableItems} = props;
  const {tabKey,id} = getSelfState(getState());
  const index = helper.findOnlyCheckedIndex(tableItems);
  if(index === -1){
    helper.showError('请勾选一条记录');
    return
  }
  const items = helper.deepCopy(tableItems);
  const newItems = swapItems(items,index,index+1);
  dispatch(action.assign({tableItems: newItems}, tabKey))
};

const addActionCreator = (props) => async(dispatch,getState) => {
  const {chooseGoodsConfig} = props;
  if (await showStaffDialog(chooseGoodsConfig)) {
  }
};


const toolbarActions = {
  close: closeActionCreator,
  upward: upwardActionCreator,
  down: downActionCreator,
  add: addActionCreator,
};


const checkActionCreator = (rowIndex, keyName, checked) => (dispatch, getState) =>{
  const {tabKey} = getSelfState(getState());
  dispatch(action.update({checked}, [tabKey,'tableItems'], rowIndex));
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
  onCheck: checkActionCreator,
};

export default connect(mapStateToProps, actionCreators)(EnhanceLoading(EditPage));
