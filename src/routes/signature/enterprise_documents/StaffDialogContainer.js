import {connect} from 'react-redux';
import StaffDialog from './StaffDialog';
import {Action} from '../../../action-reducer/action';
import showPopup from '../../../standard-business/showPopup';
import helper from '../../../common/common';

const action = new Action(['temp'], false);


const getSelfState = (state) => {
  return state.temp || {};
};

const buildState = (config, items) => {
  return {
    ...config,
    items:items,
    searchData:{},
    visible: true,
  };
};


const checkActionCreator = (isAll, checked, rowIndex) => {
  isAll && (rowIndex = -1);
  return action.update({checked}, 'items', rowIndex);
};


const okActionCreator = () => async (dispatch, getState) => {

};

const closeActionCreator = () => (dispatch) => {
  dispatch(action.assign({visible: false, ok: false}));
};


const searchActionTor = () => async (dispatch, getState) => {
  const {searchData} = getSelfState(getState());
  console.log(searchData);
};


const resetActionCreator = () => async (dispatch, getState) => {
  dispatch( action.assign({searchData: {}}) );
};

const clickActionCreators = {
  ok: okActionCreator,
  search:searchActionTor,
  close: closeActionCreator,
  reset: resetActionCreator,
};

const clickActionCreator = (key) => {
  if (clickActionCreators.hasOwnProperty(key)) {
    return clickActionCreators[key]();
  } else {
    return {type: 'unknown'};
  }
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const changeActionCreator = (key, value) => (dispatch) =>{
  dispatch(action.assign({[key]: value}, 'searchData'));
};


const actionCreators = {
  onCheck: checkActionCreator,
  onClick: clickActionCreator,
  onChange: changeActionCreator,
};

const URL_CONFIG = '/api/signature/enterprise_documents/config';
export default async (result) => {
  const config = helper.getJsonResult(await helper.fetchJson(URL_CONFIG));
  const Container = connect(mapStateToProps, actionCreators)(StaffDialog);
  global.store.dispatch(action.create(buildState(result ? result : config.chooseGoodsConfig, [])));
  await showPopup(Container, {}, true);

  const state = getSelfState(global.store.getState());
  global.store.dispatch(action.create({}));
  return state.ok;
};
