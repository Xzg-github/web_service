import {Action} from '../../../../action-reducer/action';
import { connect } from 'react-redux';
import {getPathValue} from '../../../../action-reducer/helper';
import Show from './Show.js'

const STATE_PATH = ['temp'];
const action = new Action(STATE_PATH);

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const buildSignState = (dispatch, title, closeFunc, result) => {
  dispatch(action.create({
    visible:true,
    title,
    closeFunc,
    result
  }))
};

//关闭
const cancelActionCreator = ({onClose}) => async(dispatch, getState) => {
  const {closeFunc} = getSelfState(getState());
  onClose();
  closeFunc && closeFunc()
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
  onCancel:cancelActionCreator,
};

const container = connect(mapStateToProps, actionCreators)(Show);
export default container;
export {buildSignState}

