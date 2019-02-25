import {connect} from 'react-redux';
import Confirm from './Confirm';
import {Action} from '../../../../../action-reducer/action';
import showPopup from '../../../../../standard-business/showPopup';
import helper from '../../../../../common/common';

const action = new Action(['temp'], false);
const URL_SET = '/api/config/commodity_price/batch_set_price';

const getSelfState = (state) => {
  return state.temp || {};
};

const buildState = () => {
  return {
    title:'企业信息变更及时更新',
    visible: true,
    value: {}
  };
};

const changeActionCreator = (key, value) => {
  return action.assign({[key]: value}, 'value');
};

const okActionCreator = () => async (dispatch, getState) => {
  const state = getSelfState(getState());
  if (helper.validValue(state.controls, state.value)) {
    const body = {
      ...state.value,
      idList: state.items.map(item => item.id)
    };
    const json = await helper.fetchJson(URL_SET, helper.postOption(body, 'put'));
    if (json.returnCode) {
      helper.showError(json.returnMsg);
    } else {
      dispatch(action.assign({visible: false, ok: true}));
    }
  } else {
    dispatch(action.assign({valid: true}));
  }
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

export default async () => {

  const Container = connect(mapStateToProps, actionCreators)(Confirm);
  global.store.dispatch(action.create(buildState()));
  await showPopup(Container, {}, true);

  const state = getSelfState(global.store.getState());
  global.store.dispatch(action.create({}));
  return state.ok;
};

