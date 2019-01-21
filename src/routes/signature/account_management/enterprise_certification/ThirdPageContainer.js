import { connect } from 'react-redux';
import ThreePage from './components/ThreePage';
import {EnhanceLoading} from '../../../../components/Enhance';
import helper,{getObject, swapItems} from '../../../../common/common';
import {Action} from '../../../../action-reducer/action';
import {getPathValue} from '../../../../action-reducer/helper';
import showOkDialog from './OkDialogContainer';

const TAB_KEY = 'three';
const STATE_PATH =  ['enterprise_certification'];


const action = new Action(STATE_PATH);

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH)[TAB_KEY];
};





//上一步  将第一步的value被第二步的替换
const previousStepAction  = (dispatch, getState) => {
  dispatch(action.assign({activeKey: 'two'}));

};

//下一步
const nextAction  = async(dispatch, getState) => {
  const {tabs,one,two} = getPathValue(getState(), STATE_PATH);
  const tab = [
    {key: 'four', title: '3.完成认证', close: false}
  ];
  dispatch(action.assign({
    activeKey:'four',
    tabs:tabs.concat(tab),
    four:{tabKey:'four'}
  }));

}


const toolbarActions = {
  previousStep:previousStepAction,
  nextStep:nextAction
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

const Container = connect(mapStateToProps, actionCreators)(ThreePage);
export default Container;
