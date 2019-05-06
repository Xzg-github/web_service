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
  const {tableItems, value} = getSelfState(getState());
  value.nativeOrderNo = tableItems[0].nativeOrderNo;
  const URL_PAY = '/api/signature/business_account/payOrder';
  const {returnCode, returnMsg, result} = await fetchJson(URL_PAY,postOption(value,'post'));
  if(returnCode !== 0){return showError(returnMsg)}
  showSuccessMsg(returnMsg);
  onClose()
};

const cancelActionCreator = ({onClose}) => () => {
  onClose();
};

const changeActionCreator = (key, value) => {
  return action.assign({[key]: value}, 'value');
};

const exitValidActionCreator = () => {
  return action.assign({valid: false});
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onOk: okActionCreator,
  onCancel:cancelActionCreator,
  onChange: changeActionCreator,
  onExitValid: exitValidActionCreator
};

const container = connect(mapStateToProps, actionCreators)(AddDialog);

export default container;
