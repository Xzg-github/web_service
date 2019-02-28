import { connect } from 'react-redux';
import AddDialog from './AddDialog';
import {Action} from '../../../../action-reducer/action';
import {getPathValue} from '../../../../action-reducer/helper';
import {postOption, fetchJson, showSuccessMsg, showError} from '../../../../common/common';

const STATE_PATH = ['temp'];
const action = new Action(STATE_PATH);

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

export const buildAddState = (config, items=[], dispatch) => {
  dispatch(action.create({
    ...config,
    visible: true,
    tableItems: items
  }));
};

const okActionCreator = ({onClose}) => async(dispatch, getState) => {
  onClose()
};

const cancelActionCreator = ({onClose}) => () => {
  onClose();
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onOk: okActionCreator,
  onCancel:cancelActionCreator,
};

const container = connect(mapStateToProps, actionCreators)(AddDialog);

export default container;
