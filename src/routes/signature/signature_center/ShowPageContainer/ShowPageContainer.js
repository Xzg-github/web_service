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

const buildShowState = (config, items=[], dispatch, title) => {
  dispatch(action.create({
    ...config,
    value: items,
    visible: true,
    title
  }))
};

//关闭
const cancelActionCreator = ({onClose}) => () => {
  onClose();
};

const okActionCreator = ({onClose}) => async(dispatch, getState) => {
  const {value} = getSelfState(getState());
  const URL_REJECT = `/api/signature/signature_center/repeal`;
  const {returnCode, returnMsg, result} = await fetchJson(`${URL_REJECT}/${value.id}`, 'get');
  if (returnCode !== 0) {
    return showError(returnMsg)
  }
  onClose();
  showSuccessMsg(returnMsg);
};

const onLinkActionCreator = (tabKey, key, rowIndex, item) => (dispatch, getState) => {

};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onOk: okActionCreator,
  onCancel:cancelActionCreator,
  onLink:onLinkActionCreator
};

const container = connect(mapStateToProps, actionCreators)(Person);
export default container;
export {buildShowState}

