/*
* 根目录
* */

import React from 'react';
import { connect } from 'react-redux';
import {EnhanceLoading} from '../../components/Enhance';
import createTabPage from '../../standard-business/createTabPage';
import {getPathValue} from '../../action-reducer/helper';
import {Action} from '../../action-reducer/action';
import helper from '../../common/common';
import OrderPage from './components/OrderPage';


const URL_USER = '/api/fadada/user';
const URL_NEXT = '/api/fadada';


const STATE_PATH = ['fadada'];
const action = new Action(STATE_PATH);

function getCookie(cookieName) {
  let strCookie = document.cookie;
  let arrCookie = strCookie.split("; ");
  for(let i = 0; i < arrCookie.length; i++){
    let arr = arrCookie[i].split("=");
    if(cookieName == arr[0]){
      return arr[1];
    }
  }
  return "";
}


const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const initActionCreator = () => async (dispatch, getState) => {
  try {
    dispatch(action.assign({status: 'loading'}));
    //初始化数据
    const json = helper.getJsonResult(await helper.fetchJson(`${URL_USER}`));

    //页面数据
    dispatch(action.assign({
      status:'page',
      value:{...json}
    }));

  }catch (e){
    helper.showError(e.message);
    dispatch(action.assign({status: 'retry'}));
  }
};


const changeActionCreator = (keyValue,key) => async(dispatch, getState) => {
  const {value} = getSelfState(getState());
  dispatch(action.assign({[key]: keyValue}, 'value'));
};

const nextActionCreator = () => async(dispatch, getState) => {
  dispatch(action.assign({loading:true}));
  const {value} = getSelfState(getState());
  const body = {
    idNumber:value.idNumber,
    realName:value.realName
  };
  const {returnCode,returnMsg} = await helper.fetchJson(URL_NEXT,helper.postOption(body));
  if(returnCode!==0){
    helper.showError(returnMsg);
    dispatch(action.assign({loading:false}));
    return
  }
  window.location.href = returnMsg
};


const actionCreators = {
  onInit: initActionCreator,
  onFormChange:changeActionCreator,
  next:nextActionCreator
};


const mapStateToProps = (state) => {
  return getSelfState(state)
};



const RootContainer = connect(mapStateToProps, actionCreators)(EnhanceLoading(OrderPage));
export default RootContainer;
