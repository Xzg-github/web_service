import { connect } from 'react-redux';
import helper from '../../common/common';
import {Action} from '../../action-reducer/action';
import {getPathValue} from '../../action-reducer/helper';


const STATE_PATH = ['registered'];
const action = new Action(STATE_PATH);
const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const URL_CONFIG = '/api/registered/config';
/*
//初始化
const initActionCreator = async (dispatch) => {
  try{
    dispatch(action.assign({status: 'loading'}));
    const config = helper.getJsonResult(await helper.fetchJson(URL_CONFIG));
    const payload = {...config, value: {}, loading: false, status: 'page'};
    dispatch(action.create(payload));
  }catch(e){
    helper.showError(e.message);
    dispatch(action.assign({status: 'retry'}));
  }
};

//输入值
const changeActionCreator = (key, value) => action.assign({[key]: value}, 'value');*/
