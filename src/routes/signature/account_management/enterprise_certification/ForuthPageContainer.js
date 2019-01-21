import { connect } from 'react-redux';
import FourthPage from './components/FourthPage';
import {EnhanceLoading} from '../../../../components/Enhance';
import helper,{getObject, swapItems} from '../../../../common/common';
import {Action} from '../../../../action-reducer/action';
import {getPathValue} from '../../../../action-reducer/helper';
import showOkDialog from './OkDialogContainer';

const TAB_KEY = 'four';
const STATE_PATH =  ['enterprise_certification'];


const action = new Action(STATE_PATH);

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH)[TAB_KEY];
};





//上一步  将第一步的value被第二步的替换
const previousStepAction  = (dispatch, getState) => {
  dispatch(action.assign({activeKey: 'two'}));

};


const toolbarActions = {
  previousStep:previousStepAction
};

const clickActionCreator = (key) => {
  if (toolbarActions.hasOwnProperty(key)) {
    return toolbarActions[key];
  } else {
    console.log('unknown key:', key);
    return {type: 'unknown'};
  }
};


const mapStateToProps = (state) => {
  return getSelfState(state);
};





const actionCreators = {
  onClick: clickActionCreator,

};

const Container = connect(mapStateToProps, actionCreators)(FourthPage);
export default Container;
