import {connect} from 'react-redux';
import AddDialog from './AddDialog';
import {Action} from '../../../../../action-reducer/action';
import showPopup from '../../../../../standard-business/showPopup';
import helper from '../../../../../common/common';

const action = new Action(['temp'], false);


const getSelfState = (state) => {
  return state.temp || {};
};

const buildState = (controls, items,title) => {
  return {
    controls,
    items,
    title,
    visible: true,
    value: {}
  };
};

const changeActionCreator = (key, value) => {
  return action.assign({[key]: value}, 'value');
};

const okActionCreator = () => async (dispatch, getState) => {

};

const closeActionCreator = () => (dispatch) => {
  dispatch(action.assign({visible: false, ok: false}));
};

const clickActionCreators = {
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

const exitValidActionCreator = () => {
  return action.assign({valid: false});
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onChange: changeActionCreator,
  onClick: clickActionCreator,
  onExitValid: exitValidActionCreator
};

export default async (controls, items,title) => {

  const Container = connect(mapStateToProps, actionCreators)(AddDialog);
  global.store.dispatch(action.create(buildState(controls, items,title)));
  await showPopup(Container, {}, true);

  const state = getSelfState(global.store.getState());
  global.store.dispatch(action.create({}));
  return state.ok;
};

