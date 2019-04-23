import {Action} from '../../../../action-reducer/action';
import { connect } from 'react-redux';
import {getPathValue} from '../../../../action-reducer/helper';
import {postOption, fetchJson, showSuccessMsg, showError} from '../../../../common/common';
import Person from './Person';

const STATE_PATH = ['temp'];
const action = new Action(STATE_PATH);

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const buildShowState = (config, items=[], dispatch, title, user, closeFunc) => {
  dispatch(action.create({
    ...config,
    value: items,
    visible: true,
    title,
    user,
    closeFunc
  }))
};

//关闭
const cancelActionCreator = ({onClose}) => () => {
  onClose();
};

const rejectActionCreator = ({onClose}) => async(dispatch, getState) => {
  const {value, closeFunc} = getSelfState(getState());
  const URL_REJECT = `/api/signature/signature_center/repeal`;
  const {returnCode, returnMsg, result} = await fetchJson(`${URL_REJECT}/${value.id}`, 'get');
  if (returnCode !== 0) {
    return showError(returnMsg)
  }
  showSuccessMsg(returnMsg);
  closeFunc()
};

const onLinkActionCreator = (tabKey, key, rowIndex, item) => (dispatch, getState) => {

};

const clickActionCreators = {
  onCancel: cancelActionCreator,
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
  onClick: clickActionCreator,
  reject: rejectActionCreator,
  onCancel:cancelActionCreator,
  onLink:onLinkActionCreator
};

const container = connect(mapStateToProps, actionCreators)(Person);
export default container;
export {buildShowState}

