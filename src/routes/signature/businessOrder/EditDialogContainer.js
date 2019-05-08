import {connect} from 'react-redux';
import EditDialog from '../../../components/EditDialog';
import helper from '../../../common/common';
import {Action} from "../../../action-reducer/action";
import {getPathValue} from "../../../action-reducer/helper";
import showPopup from '../../../standard-business/showPopup';

const STATE_PATH = ['temp'];
const action = new Action(STATE_PATH);

const URL_RECEIPT = '/api/signature/businessOrder/receipt';
const URL_AUDIT = '/api/signature/businessOrder/audit';

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const changeActionCreator = (key, value) => {
  return action.assign({[key]: value}, 'value');
};

const exitValidActionCreator = () => {
  return action.assign({valid: false});
};

const okActionCreator = () => async (dispatch, getState) => {
  const {value, controls, tag} = getSelfState(getState());
  if (!helper.validValue(controls, value)){
    dispatch(action.assign({valid: true}));
    return helper.showError('请填写必填项');
  }
  dispatch(action.assign({confirmLoading: true}));
  const url = tag === 'edit' ? URL_RECEIPT : URL_AUDIT;
  const {returnCode, returnMsg} = await helper.fetchJson(url, helper.postOption(helper.convert(value)));
  if (returnCode !== 0) {
    helper.showError(returnMsg);
    return dispatch(action.assign({confirmLoading: false}));
  }
  helper.showSuccessMsg('操作成功');
  dispatch(action.assign({confirmLoading: false, visible: false, res: true}));
};

const cancelActionCreator = () => (dispatch) => {
  dispatch(action.assign({visible: false}))
};

const actionCreator = {
  onChange: changeActionCreator,
  onExitValid: exitValidActionCreator,
  onOk: okActionCreator,
  onCancel: cancelActionCreator
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

export default async (config, data={}, tag='edit') => {
  const payload = {
    tag,
    config: config.config,
    controls: config.controls,
    title: config.title,
    value: data,
    visible: true,
    confirmLoading: false,
    size: tag === 'edit' ? 'extra-small' : 'default'
  };
  global.store.dispatch(action.create(payload));
  const Container = connect(mapStateToProps, actionCreator)(EditDialog);
  return showPopup(Container, {}, true);
}



