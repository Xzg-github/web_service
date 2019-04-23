import {Action} from '../../../../action-reducer/action';
import { connect } from 'react-redux';
import {getPathValue} from '../../../../action-reducer/helper';
import Person from './Person';
import reasonDiaLog from './reasonDialog/ReasonContainer'

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
  const id = value.id;
  const controls = [{key: 'revokeReason', title: '撤销原因', type: 'text', required: true}];
  if (await reasonDiaLog(controls, closeFunc, id, {} )) {
  }
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
};

const container = connect(mapStateToProps, actionCreators)(Person);
export default container;
export {buildShowState}

