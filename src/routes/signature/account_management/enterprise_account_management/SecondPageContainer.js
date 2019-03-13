import { connect } from 'react-redux';
import SecondPage from '../personal_account_management/components/SecondPage';
import {EnhanceLoading} from '../../../../components/Enhance';
import helper,{getObject, swapItems} from '../../../../common/common';
import {Action} from '../../../../action-reducer/action';
import {getPathValue} from '../../../../action-reducer/helper';
import showDiaLog from '../personal_account_management/ShowDiaLog/UploadDialogContainer';
import execWithLoading from '../../../../standard-business/execWithLoading';


const TAB_KEY = 'two';
const STATE_PATH =  ['enterprise_account_management'];

const URL_SIGN = '/api/signature/account_management/personal_account_management/sign';//查询列表
const URL_DEFAULT = '/api/signature/account_management/personal_account_management/default';//设置默认
const URL_DEL = '/api/signature/account_management/personal_account_management/delSign';//设置默认

//刷新表格
const updateTable = async (dispatch, getState) => {
  execWithLoading(async () => {
    const jsonResult = helper.getJsonResult(await helper.fetchJson(URL_SIGN));
    let radioValue = {};
    for(let json of jsonResult){
      if(json.isDefaultSeal == 1){

      }
      radioValue[json.id] = json.isDefaultSeal == 1 ? true:false
    }
    dispatch(action.assign({
      uploadList:jsonResult?jsonResult:[],
      checkValue:{},
      radioValue,
      status: 'page',
    }, TAB_KEY));
  });
};


const action = new Action(STATE_PATH);

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH)[TAB_KEY];
};

const initActionCreator = () => async (dispatch, getState) => {


  dispatch(action.assign({status: 'loading'}, TAB_KEY));
  try {
    const state = getSelfState(getState());
    const jsonResult = helper.getJsonResult(await helper.fetchJson(URL_SIGN));
    let radioValue = {};
    for(let json of jsonResult){
      if(json.isDefaultSeal == 1){

      }
      radioValue[json.id] = json.isDefaultSeal == 1 ? true:false
    }
    dispatch(action.assign({
      ...state,
      uploadList:jsonResult?jsonResult:[],
      checkValue:{},
      radioValue,
      status: 'page',
    }, TAB_KEY));

  } catch (e) {
    helper.showError(e.message);
    dispatch(action.assign({status: 'retry'}, TAB_KEY));
  }
};

const addAction = () => async (dispatch, getState) => {
  const {edit} = getSelfState(getState());

  if (await showDiaLog(edit,{},false)) {
    return updateTable(dispatch,getState)
  }
};

const delAction = () => async (dispatch, getState) => {
  const {checkValue,radioValue} = getSelfState(getState());
  let ids = [];
  let radios = [];

  for(let v in checkValue){
    checkValue[v]&&(ids.push(v))
  }
  for(let v in radioValue){
    radioValue[v] && (radios.push(v))
  }

  if(ids.length !== 1){
    helper.showError('请勾选一个');
    return
  }

  if(ids[0] === radios[0]){
    helper.showError('默认签章不能删除');
    return
  }

  const url = `${URL_DEL}/${ids[0]}`;
  const {result,returnCode,returnMsg} = await helper.fetchJson(url,'delete');
  if(returnCode!=0){
    helper.showError(returnMsg);
    return
  }
  helper.showSuccessMsg(returnMsg);
  return updateTable(dispatch,getState)
};



const toolbarActions = {
  add:addAction,
  del:delAction
};

const clickActionCreator = (key) => {
  if (toolbarActions.hasOwnProperty(key)) {
    return toolbarActions[key]();
  } else {
    return {type: 'unknown'};
  }
};

const changeActionCreator = (key, value) => (dispatch,getState) =>{
  dispatch(action.assign({[key]: value}, [TAB_KEY,'value']));
};

const checkActionCreator = (checked,key) => (dispatch,getState) =>{
  dispatch(action.assign({[key]: checked}, [TAB_KEY,'checkValue']))
};

const radioActionCreator = (radio,key) => async(dispatch,getState) =>{
  const url = `${URL_DEFAULT}/${key}`;
  const {result,returnCode,returnMsg} = await helper.fetchJson(url)
  if(returnCode!=0){
    helper.showError(returnMsg);
    return
  }
  helper.showSuccessMsg(returnMsg);
  dispatch(action.assign({[key]: radio}, [TAB_KEY,'radioValue']))
  return updateTable(dispatch,getState)

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
  onInit: initActionCreator,
  onExitValid: exitValidActionCreator,
  onCheck:checkActionCreator,
  onRadio:radioActionCreator
};

const Container = connect(mapStateToProps, actionCreators)(EnhanceLoading(SecondPage));
export default Container;
