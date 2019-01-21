import { connect } from 'react-redux';
import OrderPage from './components';
import helper,{getObject, swapItems} from '../../../../common/common';
import {Action} from '../../../../action-reducer/action';
import {getPathValue} from '../../../../action-reducer/helper';

const TAB_KEY = 'one';
const STATE_PATH =  ['enterprise_certification'];


const action = new Action(STATE_PATH);

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH)[TAB_KEY];
};

//下一步
const nextAction  = (dispatch, getState) => {
  const {tabs,two} = getPathValue(getState(), STATE_PATH);
  const {value = {},srcObj,controlsLeft,controlsRight,uploadBox} = getSelfState(getState());

  //校验必填
  let controls = [...controlsRight,...controlsLeft];

  if (!helper.validValue(controls,value)) {
    dispatch(action.assign({valid: true},TAB_KEY));
    return
  }

  for(let box of uploadBox){
    if(!value[box.key]){
      return helper.showError(`${box.title}不能为空`)
    }
  }


  if (helper.isTabExist(tabs, 'two')) {
    dispatch(action.assign({activeKey: 'two'}));
    dispatch(action.assign({value},'two'));
    return
  }
  const tab = [
    {key: 'two', title: '2.完善管理人信息', close: false}
  ];
  dispatch(action.assign({
    activeKey:'two',
    tabs:tabs.concat(tab),
    two:{tabKey:'two',value,srcObj,...two}
  }));
};


const toolbarActions = {
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

/*
* 图片已键值对存在value中
* 最后统一发给后端
* */
const uploadChangeActionCreator = (key,file) => async(dispatch,getState) => {
  const {srcObj={}} = getSelfState(getState());
  if(file.size / 1024 / 1024  >  20){
    helper.showError('图片大小需小于20MB');
    return
  }
  let srcImg;
  const reader=new FileReader();//读取本地文件,预览图片
  reader.readAsDataURL(file);
  reader.onload =  (result) => {
    srcImg = result.target.result;
    dispatch(action.assign({[key]: srcImg}, [TAB_KEY,'srcObj']));
    dispatch(action.assign({[key]: file}, [TAB_KEY,'value']));
  };
};


const changeActionCreator = (key, value) => (dispatch,getState) =>{
  dispatch(action.assign({[key]: value}, [TAB_KEY,'value']));
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const exitValidActionCreator = () => {
  return action.assign({valid: false},TAB_KEY);
};


const actionCreators = {
  onClick: clickActionCreator,
  onChange: changeActionCreator,
  onUploadChange: uploadChangeActionCreator,
  onExitValid: exitValidActionCreator
};

const Container = connect(mapStateToProps, actionCreators)(OrderPage);
export default Container;
