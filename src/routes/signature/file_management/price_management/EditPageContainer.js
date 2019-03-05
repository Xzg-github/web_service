import { connect } from 'react-redux';
import {EnhanceLoading} from '../../../../components/Enhance';
import {Action} from '../../../../action-reducer/action';
import {getPathValue} from '../../../../action-reducer/helper';
import helper from '../../../../common/common';
import EditPage from './EditPage';
import showDiaLog from './DialogContainer'

const STATE_PATH =  ['price_management'];
const action = new Action(STATE_PATH);

const URL_DROP = '/api/signature/file_management/price_management/dropDown';//下拉
const URL_UPDATE = '/api/signature/file_management/price_management/update';//新增or编辑
const URL_ONE = '/api/signature/file_management/price_management/one'; //获取单条记录

const getSelfState = (rootState) => {
  const parent = getPathValue(rootState, STATE_PATH);
  return parent[parent.activeKey];
};

const initActionCreator = () => async (dispatch, getState) => {
  const {editConfig} = getPathValue(getState(), STATE_PATH);
  const {tabKey,id} = getSelfState(getState());
  dispatch(action.assign({status: 'loading'}, tabKey));
  try {
    let value = {};
    let tableItems = [];
    if(id){
      const json = helper.getJsonResult(await helper.fetchJson(`${URL_ONE}/${id}`));
      value = json;
      tableItems = json.detailDtoList;
    }

    dispatch(action.assign({
      ...editConfig,
      value,
      valid:false,
      tableItems,
      status: 'page',
      options: {},
    }, tabKey));


  } catch (e) {
    helper.showError(e.message);
    dispatch(action.assign({status: 'retry'}, tabKey));
  }
};


const closeActionCreator = (props) => () => {
  props.onTabClose(props.tabKey);
};


const addAction = (props) => (dispatch, getState) => {
  const {tableItems,tabKey} = getSelfState(getState());
  dispatch(action.add({}, [tabKey,'tableItems'], 0))
};

const delAction  = (props) =>(dispatch, getState) => {
  const {tableItems,tabKey} = getSelfState(getState());
  const newItems = tableItems.filter(item => !item.checked);
  dispatch(action.assign({tableItems: newItems},tabKey));
};

const saveAction  = (props) =>async(dispatch, getState) => {
  const {tableItems,tabKey,value,controls,cols,updateTable,edit} = getSelfState(getState());
  if (!helper.validValue(controls, value)) {
    dispatch(action.assign({valid: true},tabKey));
    return;
  }
  if(tableItems.length == 0 ){
    helper.showError('报价明细信息不能为空');
    return
  }
  if(!helper.validArray(cols,tableItems)){
    dispatch(action.assign({valid: true},tabKey));
    return;
  }

  const body = {
    ...value,
    detailDtoList:tableItems.map(item => helper.convert(item)),
    statusType:'status_draft'
  };

  const {result,returnCode,returnMsg} = await helper.fetchJson(URL_UPDATE,helper.postOption(body,edit?'put':'post'));
  if(returnCode !== 0 ){
    helper.showError(returnMsg);
    return
  }
  props.onTabClose(props.tabKey);
  return updateTable(dispatch, getState)

};


const submitAction  = (props) =>async(dispatch, getState) => {
  const {tableItems,tabKey,value,controls,cols,updateTable,edit} = getSelfState(getState());
  if (!helper.validValue(controls, value)) {
    dispatch(action.assign({valid: true},tabKey));
    return;
  }
  if(tableItems.length == 0 ){
    helper.showError('报价明细信息不能为空');
    return
  }
  if(!helper.validArray(cols,tableItems)){
    dispatch(action.assign({valid: true},tabKey));
    return;
  }

  const body = {
    ...value,
    detailDtoList:tableItems.map(item => helper.convert(item)),
    statusType:'wait_status_effective_completed'
  };

  const {result,returnCode,returnMsg} = await helper.fetchJson(URL_UPDATE,helper.postOption(body,edit?'put':'post'));
  if(returnCode !== 0 ){
    helper.showError(returnMsg);
    return
  }
  props.onTabClose(props.tabKey);
  return updateTable(dispatch, getState)

};

const setAction = () => async (dispatch, getState) => {
  const {diaLog,tableItems,tabKey} = getSelfState(getState());
  const index = helper.findOnlyCheckedIndex(tableItems);
  if (index === -1) {
    helper.showError('请勾选一条记录进行设置阶梯');
    return;
  }else if(!tableItems[index].chargeWay ||  tableItems[index].chargeWay == 'fixedPrice'){
    helper.showError('计费方式为阶梯价格才可设置阶梯');
    return
  }
  let result = await showDiaLog(diaLog,{});
  if (result.length > 0) {
    dispatch(action.update({['priceRule']: JSON.stringify(result[0])}, [tabKey,'tableItems'], index));
    dispatch(action.update({['ruleGuid']: result[0].ruleName}, [tabKey,'tableItems'], index));
  }
};


const toolbarActions = {
  add:addAction,
  del: delAction,
  set: setAction,
  save:saveAction,
  submit:submitAction,
  close: closeActionCreator,
};

const changeActionCreator = (key, keyValue) => async(dispatch, getState) => {
  const {tabKey,controls,value} = getSelfState(getState());
  const newControls = JSON.parse(JSON.stringify(controls));
  if(key === 'priceType'){
    //按客户报价,controls有客户
    if(keyValue === 'quoteByCustomer'){
      const obj = {key:'customerId',title:'客户名称',type:'select',required:true};
      newControls.splice(3,0,obj);
    }else {
      newControls.length === 9 && (newControls.splice(3,1));
      dispatch(action.assign({['customerId']: ''}, [tabKey, 'value']));
    }
    dispatch(action.assign({controls:newControls}, [tabKey]));
  }
  dispatch(action.assign({[key]: keyValue}, [tabKey, 'value']));
};

const clickActionCreator = (props, key) => {
  if (toolbarActions.hasOwnProperty(key)) {
    return toolbarActions[key](props);
  } else {
    return {type: 'unknown'};
  }
};

const checkActionCreator = (rowIndex, keyName, checked) => async(dispatch, getState) => {
  const {tabKey} = getSelfState(getState());
  dispatch(action.update({checked}, [tabKey,'tableItems'], rowIndex));
};

const contentChangeActionCreator = (rowIndex, keyName, keyValue) => (dispatch, getState) => {
  const {tabKey} = getSelfState(getState());
  if(keyName === 'chargeWay' && keyValue === 'fixedPrice'){
    dispatch(action.update({['priceRule']: null}, [tabKey,'tableItems'], rowIndex));
    dispatch(action.update({['ruleGuid']: ''}, [tabKey,'tableItems'], rowIndex));
  }
  dispatch(action.update({[keyName]: keyValue}, [tabKey,'tableItems'], rowIndex));
};

const searchActionCreator= (rowIndex,key, title) => async (dispatch, getState) => {
  const {tabKey} = getSelfState(getState());
  let body,url,json;
  switch (key) {
    case 'businessItemId' :{
      body = {
        maxNumber:20,
        //itemName:title
      };
      url = URL_DROP;
      break;
    }
    default :
      return
  }
  json = await helper.fetchJson(url,helper.postOption(body));
  if(json.returnCode !== 0 ){
    helper.showError(json.returnMsg);
  }
  dispatch(action.assign({[key]: json.result}, [tabKey, 'options']));
};

const exitValidActionCreator = () => (dispatch, getState) => {
  const {tabKey} = getSelfState(getState());
  dispatch(action.assign({valid: false}, tabKey));
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onInit: initActionCreator,
  onClick: clickActionCreator,
  onChange: changeActionCreator,
  onCheck: checkActionCreator,
  onSearch: searchActionCreator,
  onExitValid: exitValidActionCreator,
  onContentChange: contentChangeActionCreator,
};

export default connect(mapStateToProps, actionCreators)(EnhanceLoading(EditPage));
