import { connect } from 'react-redux';
import AddDialog from './AddDialog';
import {Action} from '../../../../../action-reducer/action';
import {getPathValue} from '../../../../../action-reducer/helper';
import {postOption, fetchJson, showSuccessMsg, showError} from '../../../../../common/common';
import {getCookie} from '../createEditPageContainer'

const STATE_PATH = ['temp'];
const action = new Action(STATE_PATH);

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const PARENT_PATH = ['signature_center'];
const parentAction = new Action(PARENT_PATH);

const getParentState =(rootState) => {
  const state = getPathValue(rootState, PARENT_PATH);
  return state[state.activeKey];
};

export const buildAddState = (config, filterItems, items=[], add, dispatch, okFunc) => {
  dispatch(action.create({
    ...config,
    okFunc,
    visible: true,
    add,
    filterItems,
    tableItems: items
  }));
};

//Input搜索框change监听
const changeActionCreator = (event) => (dispatch, getState) =>{
  const {title} = getSelfState(getState());
  if(title === '从联系人中添加'){
    dispatch(action.assign({formValue: event.target.value}));
    const { filterItems, formValue} = getSelfState(getState());
    let newTableItems = [];
    filterItems.forEach((item) => {
      if(item.companyContactName.toLowerCase().indexOf(formValue.toLowerCase()) > -1) {
        newTableItems.push(item);
      }
      if(item.companyContactAccount.toLowerCase().indexOf(formValue.toLowerCase()) > -1) {
        newTableItems.push(item);
      }
    });
    dispatch(action.assign({tableItems: newTableItems}));
  }else{
    dispatch(action.assign({formValue: event.target.value}));
    const { filterItems, formValue} = getSelfState(getState());
    let newTableItems = [];
    filterItems.forEach((item) => {
      if(item.signGroupName.toLowerCase().indexOf(formValue.toLowerCase()) > -1) {
        newTableItems.push(item);
      }
      if(item.companyContactName.toLowerCase().indexOf(formValue.toLowerCase()) > -1){
        newTableItems.push(item)
      }
    });
    dispatch(action.assign({tableItems: newTableItems}));
  }

};

//修改数组对象key值
const changeKey = (arr, key) => {
  let newArr = [];
  arr.forEach((item, index) => {
    let newObj = {};
    for(let i = 0; i < key.length; i++ ){
      newObj[key[i]] = item[Object.keys(item)[i]]
    }
    newArr.push(newObj);
  });
  return newArr
};

const okActionCreator = ({okFunc, onClose}) => async(dispatch, getState) => {
  const {value, groupConfig, contactConfig} = getParentState(getState());
  const {filterItems, title} = getSelfState(getState());
  const checkId = [];
    if(title === '从联系人中添加'){
      filterItems.forEach(item => {
        item.checked && (checkId.push(item))
      });
      const changeItems = changeKey(checkId, ['id', 'signPartyName', 'account']);
      for(let i=0; i< changeItems.length; i++){
        delete changeItems[i].id
      }
      const newItems = value.signPartyList.concat(changeItems);
      okFunc(newItems);
      onClose();
    }else{
      if(value.signWay === '1' || value.signWay === 1){
        const URL_ACCOUNT = '/api/signature/signature_center/getName';
        let token = getCookie('token');
        const {returnCode, returnMsg, result} = await fetchJson(`${URL_ACCOUNT}/${token}`,'get');
        if(returnCode !== 0) return showError('当前发起人获取失败');
        const email = result.userEmail;
        const signPartyName = result.username;
        const list = [{account:email, signPartyName, readonly: true}];
        filterItems.forEach(item => {item.checked && (checkId.push(item))}); //勾选记录
        if(checkId.length !==1){return showError('签署群组只能勾选一条！')} //判断勾选一条
        const onlyFilter = checkId[0].concatMemberVos;
        for(let i = 0; i < onlyFilter.length; i++){
          delete onlyFilter[i].id
        }
        let newMap = [];
        for( let [index, elem] of new Map(onlyFilter.map((item, i) => [i, item]))){  //通过Map数组解构去重，并修改数组对象中的Key值
          let i = {
            signPartyName: elem.companyContactName,  //转换数组对象中的key
            account: elem.companyContactAccount
          };
          newMap.push(i)
        }
        const newItems = list.concat(newMap);
        okFunc(newItems);
        onClose()
      }else if(value.signWay === '0' || value.signWay === 0){
        filterItems.forEach(item => {item.checked && (checkId.push(item))}); //勾选记录
        if(checkId.length !==1){return showError('签署群组只能勾选一条！')} //判断勾选一条
        const onlyFilter = checkId[0].concatMemberVos;
        for(let i = 0; i < onlyFilter.length; i++){
          delete onlyFilter[i].id
        }
        let newMap = [];
        for( let [index, elem] of new Map(onlyFilter.map((item, i) => [i, item]))){  //通过Map数组解构去重，并修改数组对象中的Key值
          let i = {
            signPartyName: elem.companyContactName,  //转换数组对象中的key
            account: elem.companyContactAccount
          };
          newMap.push(i)
        }
        okFunc(newMap);
        onClose()
      }

    }
};

const checkActionCreator = (isAll, checked, rowIndex) => (dispatch,getState) => {
  let id = [];
  isAll && (rowIndex = -1);
  dispatch(action.update({checked}, 'tableItems', rowIndex));
  const {tableItems} = getSelfState(getState());
  tableItems.forEach(item => {
    item.checked && (id.push(item))
  });
  dispatch(action.assign({filterItems: id}));
};

const cancelActionCreator = ({onClose}) => () => {
  onClose();
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onCheck: checkActionCreator,
  onOk: okActionCreator,
  onCancel:cancelActionCreator,
  onChange: changeActionCreator
};

const container = connect(mapStateToProps, actionCreators)(AddDialog);

export default container;
