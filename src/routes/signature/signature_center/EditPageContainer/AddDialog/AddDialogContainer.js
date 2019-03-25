import { connect } from 'react-redux';
import AddDialog from './AddDialog';
import {Action} from '../../../../../action-reducer/action';
import {getPathValue} from '../../../../../action-reducer/helper';
import {postOption, fetchJson, showSuccessMsg, showError} from '../../../../../common/common';

const STATE_PATH = ['temp'];
const action = new Action(STATE_PATH);

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const PARENT_PATH = ['signature_center'];
const parentAction = new Action(PARENT_PATH);

const getParentState =(rootState) => {
  const state = getPathValue(rootState, PARENT_PATH);
  return state[state.activeKey];
};

export const buildAddState = (config, filterItems, items=[], add, dispatch, okFunc) => {
  dispatch(action.create({
    ...config,
    okFunc,
    visible: true,
    add,
    filterItems,
    tableItems: items
  }));
};

//Input搜索框change监听
const changeActionCreator = (event) => (dispatch, getState) =>{
  dispatch(action.assign({formValue: event.target.value}));
  const { filterItems, formValue} = getSelfState(getState());
  let newTableItems = [];
  filterItems.forEach((item) => {
    if(item.companyContactName.toLowerCase().indexOf(formValue.toLowerCase()) > -1) {
      newTableItems.push(item);
    }
  });
  dispatch(action.assign({tableItems: newTableItems}));
};

const okActionCreator = ({okFunc, onClose}) => async(dispatch, getState) => {
/*  const {value} = getParentState(getState());
  const {filterItems} = getSelfState(getState());
  const oldArray = value.signPartyList;
  const checkId = [];
  filterItems.forEach(item => {
    item.checked && (checkId.push(item))
  });
  const newItems = value.signPartyList.concat(checkId);
  dispatch(parentAction.assign({signPartyList: newItems}, 'value'));*/
  okFunc();
  onClose();
};

const checkActionCreator = (isAll, checked, rowIndex) => (dispatch,getState) => {
  let id = [];
  isAll && (rowIndex = -1);
  dispatch(action.update({checked}, 'tableItems', rowIndex));
  const {tableItems} = getSelfState(getState());
  tableItems.forEach(item => {
    item.checked && (id.push(item))
  });
  dispatch(action.assign({filterItems: id}));
};

const cancelActionCreator = ({onClose}) => () => {
  onClose();
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onCheck: checkActionCreator,
  onOk: okActionCreator,
  onCancel:cancelActionCreator,
  onChange: changeActionCreator
};

const container = connect(mapStateToProps, actionCreators)(AddDialog);

export default container;
