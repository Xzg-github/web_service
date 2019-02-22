import { connect } from 'react-redux';
import OrderPage from './components';
import {EnhanceLoading} from '../../../../components/Enhance';
import helper,{getObject, swapItems} from '../../../../common/common';
import {Action} from '../../../../action-reducer/action';
import {getPathValue} from '../../../../action-reducer/helper';
import showOkDialog from './OkDialogContainer';

const TAB_KEY = 'two';
const STATE_PATH =  ['enterprise_certification'];


const action = new Action(STATE_PATH);

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH)[TAB_KEY];
};

const initActionCreator = () => async (dispatch, getState) => {
  const state = getSelfState(getState());
  const {srcObj = {},value={}} = state;

  dispatch(action.assign({status: 'loading'}, TAB_KEY));
  try {
    dispatch(action.assign({
      ...state,
      srcObj,
      value,
      status: 'page',
    }, TAB_KEY));

  } catch (e) {
    helper.showError(e.message);
    dispatch(action.assign({status: 'retry'}, TAB_KEY));
  }
};

//下一步
const nextAction  = async(dispatch, getState) => {
  const {tabs,one,two,isLook} = getPathValue(getState(), STATE_PATH);
  //只读
  if(isLook){
    dispatch(action.assign({activeKey: 'three'}));
    return
  }

  const {value = {},controlsLeft,controlsRight,uploadBox} = getSelfState(getState());

  //校验必填
  let controls = [...controlsLeft,...controlsRight];


  if (!helper.validValue(controls,value)) {
    dispatch(action.assign({valid: true},TAB_KEY));
    return
  }

  for(let box of uploadBox){
    if(!value[box.key]){
      return helper.showError(`${box.title}不能为空`)
    }
  }



  if (await showOkDialog(value)) {
    const tab = [
      {key: 'three', title: '3.银行打款', close: false}
    ];
    dispatch(action.assign({
      activeKey:'three',
      tabs:tabs.concat(tab),
      one:{isLook:true,...one},
      two:{isLook:true,...two},
      three:{tabKey:'three'}
    }));
  }
};


//上一步  将第一步的value被第二步的替换
const previousStepAction  = (dispatch, getState) => {
  const {value} = getSelfState(getState());
  dispatch(action.assign({value},'one'));
  const {one} = getPathValue(getState(), STATE_PATH);
  dispatch(action.assign({activeKey: 'one'}));

};


const toolbarActions = {
  nextStep:nextAction,
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
  onInit: initActionCreator,
  onExitValid: exitValidActionCreator
};

const Container = connect(mapStateToProps, actionCreators)(EnhanceLoading(OrderPage));
export default Container;
