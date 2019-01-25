import { connect } from 'react-redux';
import {EnhanceLoading} from '../../../../components/Enhance';
import {Action} from '../../../../action-reducer/action';
import {getPathValue} from '../../../../action-reducer/helper';
import helper from '../../../../common/common';
import EditPage from './EditPage';
import showStaffDialog from '../../enterprise_documents/StaffDialogContainer'

const STATE_PATH =  ['signature_group'];
const action = new Action(STATE_PATH);

const URL_UPDATE = '/api/signature/file_management/signature_group';//新增or编辑

const getSelfState = (rootState) => {
  const parent = getPathValue(rootState, STATE_PATH);
  return parent[parent.activeKey];
};

const initActionCreator = () => async (dispatch, getState) => {
  const {editConfig} = getPathValue(getState(), STATE_PATH);
  const {tabKey,value ={}} = getSelfState(getState());
  dispatch(action.assign({status: 'loading'}, tabKey));
  if(value.list){
    for(let item of value.list){
      if(item.registerType === 'phone_number'){
        item.account = item.phoneNumber;
      }else if(item.registerType === 'email'){
        item.account = item.email;
      }
    }
  }

  try {
    dispatch(action.assign({
      ...editConfig,
      value,
      tableItems:value.list ? value.list : [],
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

const swapItems = (arr, index1, index2) => {
  if(index2  >= arr.length){
    index2 = 0
  }
  arr[index1] = arr.splice(index2, 1, arr[index1])[0];
  return arr;
};

const upwardActionCreator = (props) => (dispatch,getState) => {
  const {tableItems} = props;
  const {tabKey,id} = getSelfState(getState());
  const index = helper.findOnlyCheckedIndex(tableItems);
  if(index === -1){
    helper.showError('请勾选一条记录');
    return
  }
  const items = helper.deepCopy(tableItems);
  const newItems = swapItems(items,index,index-1);
  dispatch(action.assign({tableItems: newItems}, tabKey))

};

const downActionCreator = (props) => (dispatch,getState) => {
  const {tableItems} = props;
  const {tabKey,id} = getSelfState(getState());
  const index = helper.findOnlyCheckedIndex(tableItems);
  if(index === -1){
    helper.showError('请勾选一条记录');
    return
  }
  const items = helper.deepCopy(tableItems);
  const newItems = swapItems(items,index,index+1);
  dispatch(action.assign({tableItems: newItems}, tabKey))
};

const addActionCreator = (props) => async(dispatch,getState) => {
  const {chooseGoodsConfig,tabKey,tableItems} = props;
  const items = await showStaffDialog(chooseGoodsConfig);
  const copyItems = JSON.parse(JSON.stringify(tableItems))
  if (items.length > 0) {
    for(let item of items){
      let isItmes = copyItems.filter(i => {
        let id = i.userAccountId ? i.userAccountId :i.id;
        return id === item.id;
      });

      if(isItmes.length == 0){

        copyItems.push(item)
      }
    }

    dispatch(action.assign({tableItems:copyItems},tabKey))
  }
};

const okActionCreator = (props) => async (dispatch,getState) => {
  const {tableItems,value,controls,tabKey,title} = props;
  if (!helper.validValue(controls, value)) {
    dispatch(action.assign({valid: true},tabKey));
    return;
  }
  value.ids = [];
  /*userAccountId 有就取userAccountId 没有就id
  * */
  for(let items of tableItems){
    value.ids.push(items.userAccountId ? items.userAccountId : items.id);
  }
  let body = {
    ids:value.ids,
    signGroupName:value.signGroupName,
    signGroupNote:value.signGroupNote,
  };
  if(title !== '新增'){
    body.id = value.id;
  }
  let json = await helper.fetchJson(URL_UPDATE,helper.postOption(body,title === '新增' ? 'post' :'put'))

  if(json.returnCode !== 0) {
    helper.showError(json.returnMsg);
    return
  }

  props.onTabClose(props.tabKey);
  props.updateTable(dispatch, getState);

};

const delActionCreator = () =>  (dispatch, getState) =>  {
  const {tableItems,tabKey} = getSelfState(getState());

    const items = tableItems.filter(item => !item.checked);

    dispatch(action.assign({tableItems: items},tabKey));

};


const toolbarActions = {
  close: closeActionCreator,
  upward: upwardActionCreator,
  down: downActionCreator,
  add: addActionCreator,
  ok:okActionCreator,
  del:delActionCreator,
};


const checkActionCreator = (rowIndex, keyName, checked) => (dispatch, getState) =>{
  const {tabKey} = getSelfState(getState());
  dispatch(action.update({checked}, [tabKey,'tableItems'], rowIndex));
};

const clickActionCreator = (props, key) => {
  if (toolbarActions.hasOwnProperty(key)) {
    return toolbarActions[key](props);
  } else {
    return {type: 'unknown'};
  }
};

const exitValidActionCreator = ()  => (dispatch, getState) =>{
  const {tabKey} = getSelfState(getState());
  dispatch(action.assign({valid: false},tabKey));
};

const changeActionCreator = (key, value)  => (dispatch, getState) =>{
  const {tabKey} = getSelfState(getState());
  dispatch(action.assign({[key]: value}, [tabKey,'value']));
};


const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onInit: initActionCreator,
  onClick: clickActionCreator,
  onCheck: checkActionCreator,
  onExitValid: exitValidActionCreator,
  onChange: changeActionCreator,
};

export default connect(mapStateToProps, actionCreators)(EnhanceLoading(EditPage));
