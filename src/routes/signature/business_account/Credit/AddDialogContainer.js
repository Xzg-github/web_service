import { connect } from 'react-redux';
import AddDialog from './AddDialog';
import {Action} from '../../../../action-reducer/action';
import {getPathValue} from '../../../../action-reducer/helper';
import helper from '../../../../common/common';
import {updateTable} from '../OrderContainer';

const STATE_PATH = ['temp'];
const action = new Action(STATE_PATH);

const URL_SAVE = '/api/signature/business_account/credits';

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

export const buildAddState = (config, item, dispatch) => {
  const value = {
    isOverdraft: item.isOverdraft,
    companyCreditInit: item.companyCreditInit === 0 ? '' : item.companyCreditInit
  };
  dispatch(action.create({
    ...config,
    visible: true,
    id: item.id,
    value,
    canShow: item.isOverdraft === 1 ? true : false
  }));
};

//输入值修改
const changeActionCreator = (key, keyValue) => (dispatch, getState) =>  {
  //设置可以透支的flag用于展示隐藏的Form
  if (key === 'isOverdraft' && keyValue == 1) {
    dispatch(action.assign({canShow: true}));
  } else if (key === 'isOverdraft' && keyValue == 0) {
    dispatch(action.assign({canShow: false}));
  }
  dispatch(action.assign({[key]: keyValue}, 'value'));
};

const okActionCreator = ({onClose}) => async (dispatch, getState) => {
  const {controls, value={}, canShow, cascade, id} = getSelfState(getState());
  const control = canShow ? controls.concat(cascade) : controls;
  if (!helper.validValue(control, value)) {
    helper.showError('请填写必填项');
    return dispatch(action.assign({valid: true}));
  }
  const transformValue = {...value, id};
  const option = helper.postOption(helper.convert(transformValue));
  const {returnCode, returnMsg} =  await helper.fetchJson(URL_SAVE, option);
  if (returnCode === 0) {
    onClose();
    return updateTable(dispatch, getState);
  } else {
    return helper.showError(returnMsg);
  }
};

const cancelActionCreator = ({onClose}) => () => {
  onClose();
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
  onExitValid: exitValidActionCreator,
};

const container = connect(mapStateToProps, actionCreators)(AddDialog);

export default container;
