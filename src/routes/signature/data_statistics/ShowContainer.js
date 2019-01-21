import { connect } from 'react-redux';
import OrderPage from '../../../components/OrderPage';
import helper,{getObject} from '../../../common/common';
import {toFormValue} from '../../../common/check';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {EnhanceLoading} from '../../../components/Enhance';
import { fetchDictionary2, setDictionary } from '../../../common/dictionary';
import name from '../../../api/dictionary/name';
import execWithLoading from '../../../standard-business/execWithLoading';
import {buildOrderPageState} from '../../../common/state';
import {commonExport} from './commonExport';

const URL_LIST  = '/api/signature/data_statistics/data';    //列表

const STATE_PATH = ['data_statistics'];
const action = new Action(STATE_PATH);
const getSelfState = (rootState) => {
  const parent = getPathValue(rootState, STATE_PATH);
  return parent[parent.activeKey];
};

//初始化
const initActionCreator = () => async (dispatch, getState) => {
  const {totalConfig, fileConfig, identityConfig, smsConfig, tabs} = getPathValue(getState(), STATE_PATH);
  const {tabKey} = getSelfState(getState());
  dispatch(action.assign({status: 'loading'}, tabKey));
  try{
    const result = helper.getJsonResult(await helper.fetchJson(URL_LIST));
    const other = {tabs, activeKey: 'index', currentPage: 1, searchData: {}, status: 'page'};
    let payload;
    if(tabKey === '111aaa'){
      payload = buildOrderPageState(result, totalConfig, other);
    }else if(tabKey === '111bbb'){
      payload = buildOrderPageState(result, fileConfig, other);
    }else if(tabKey === '111ccc'){
      payload = buildOrderPageState(result, identityConfig, other);
    }else{
      payload = buildOrderPageState(result, smsConfig, other);
    }
    dispatch(action.assign(payload, tabKey));
  }catch (e){
    helper.showError(e.message);
    dispatch(action.assign({status: 'retry'}));
  }
};

//清空
const resetActionCreator = (dispatch, getState) => {
  const {tabKey} = getSelfState(getState());
  dispatch(action.assign({searchData: {}}, tabKey));
};

//搜索
const searchClickActionCreator = async (dispatch, getState) => {

};

//勾选
const checkActionCreator = (isAll, checked, rowIndex) =>  (dispatch, getState) =>{
  const {tabKey} = getSelfState(getState());
  isAll && (rowIndex = -1);
  dispatch(action.update({checked}, [tabKey, 'tableItems'], rowIndex));
};

//修改输入值
const changeActionCreator = (key, value) => (dispatch,getState) =>{
  const {tabKey} = getSelfState(getState());
  dispatch(action.assign({[key]: value}, [tabKey, 'searchData']));
};

//导出
const exportActionCreator =(dispatch,getState)=>{
  const {tableCols, searchData} = getSelfState(getState());
  return commonExport(dispatch, getState, getSelfState(getState()), action, URL_LIST, searchData,true);
};


const toolbarActions = {
  search: searchClickActionCreator,
  reset: resetActionCreator,
  export:exportActionCreator,
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
  onInit: initActionCreator,
  onClick: clickActionCreator,
  onChange: changeActionCreator,
  onCheck: checkActionCreator,
};


export default connect(mapStateToProps, actionCreators)(EnhanceLoading(OrderPage));
