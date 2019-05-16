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

export const buildAddState = (config, filterItems, items=[], add, dispatch, okFunc, value) => {
  dispatch(action.create({
    ...config,
    okFunc,
    visible: true,
    add,
    filterItems,
    tableItems: items,
    value
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
      if(item.companyContactName.toLowerCase().indexOf(formValue.toLowerCase()) > -1 || item.companyContactAccount.toLowerCase().indexOf(formValue.toLowerCase()) > -1) {
        newTableItems.push(item);
      }
    });
    dispatch(action.assign({tableItems: newTableItems}));
  }else{
    dispatch(action.assign({formValue: event.target.value}));
    const { filterItems, formValue} = getSelfState(getState());
    let newTableItems = [];
    filterItems.forEach((item) => {
      if(item.signGroupName.toLowerCase().indexOf(formValue.toLowerCase()) > -1 || item.companyContactName.toLowerCase().indexOf(formValue.toLowerCase()) > -1) {
        newTableItems.push(item);
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
  const URL_ACCOUNT_STATUS = '/api/signature/signature_center/account';
  const checkId = [];
    if(title === '从联系人中添加'){             //从联系人中添加
      filterItems.forEach(item => {item.checked && (checkId.push(item))});
      const totalItems = value.signPartyList.concat(checkId);
      const data = [];
      for(let [index, elem] of new Map( totalItems.map( ( item, i ) => [ i, item ] ) )){
        let i = {
          signPartyName:elem.companyContactName || elem.signPartyName,
          account: elem.companyContactAccount || elem.account
        };
        data.push(i)
      }
      const {result, returnCode, returnMsg} = await fetchJson(URL_ACCOUNT_STATUS, postOption(data, 'post'));
      if(returnCode !== 0){return showError(returnMsg)}
      if(value.signWay === '1'){result[0].readonly= true}     //如果是签署文件，发起人为不可编辑
      okFunc(result);
      onClose();
    }else{
      filterItems.forEach(item => {item.checked && (checkId.push(item))}); //勾选记录
      if(checkId.length !==1){return showError('签署群组只能勾选一条！')} //判断勾选一条
      const onlyFilter = checkId[0].concatMemberVos;
      const totalItems = value.signPartyList.concat(onlyFilter);
      const newItems = [];
      for(let [index, elem] of new Map( totalItems.map( ( item, i ) => [ i, item ] ) )){
        let i = {
          signPartyName:elem.companyContactName || elem.signPartyName,
          account: elem.companyContactAccount || elem.account
        };
        newItems.push(i)
      }
      let hash = {};
      const data = newItems.reduce((preVal, curVal) => {
        hash[curVal.account] ? '' : hash[curVal.account] = true && preVal.push(curVal);
        return preVal
      }, []);
      const {result, returnMsg, returnCode} = await fetchJson(URL_ACCOUNT_STATUS, postOption(data, 'post'));
      if(returnCode !== 0){return showError(returnMsg)}
      if(value.signWay === '1'){result[0].readonly= true }//如果是签署文件，发起人为不可编辑
      okFunc(result);
      onClose()
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
