import {connect} from 'react-redux';
import ShareDialog from './ShareDialog';
import {Action} from '../../../action-reducer/action';
import showPopup from '../../../standard-business/showPopup';
import helper from '../../../common/common';
import showStaffDialog from './StaffDialogContainer'

const action = new Action(['enterprise_documents_edit'], false);


const getSelfState = (state) => {
  return state.enterprise_documents_edit || {};
};

const buildState = (config, items) => {
  return {
    ...config,
    items:items,
    title: '文件共享',
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

const addActionCreator = () => async (dispatch, getState) => {
  if (await showStaffDialog()) {
  }
};

const clickActionCreators = {
  add:addActionCreator,
  ok: okActionCreator,
  close: closeActionCreator
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

const actionCreators = {
  onCheck: checkActionCreator,
  onClick: clickActionCreator,
};

export default async (config, items=[]) => {
  const Container = connect(mapStateToProps, actionCreators)(ShareDialog);
  global.store.dispatch(action.create(buildState(config, items)));
  await showPopup(Container, {}, true);

  const state = getSelfState(global.store.getState());
  global.store.dispatch(action.create({}));
  return state.ok;
};
