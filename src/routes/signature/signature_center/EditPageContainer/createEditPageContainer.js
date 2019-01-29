import { connect } from  'react-redux';
import EditPage from './EditPage';
import {EnhanceLoading} from '../../../../components/Enhance';
import {fetchJson, getJsonResult, postOption, showError, showSuccessMsg, validValue, validArray} from "../../../../common/common";
import {fetchAllDictionary, setDictionary2} from "../../../../common/dictionary";
import helper from '../../../../common/common';
import showPopup from '../../../../standard-business/showPopup';
import AddDialogContainer, {buildAddState} from './AddDialog/AddDialogContainer';
import upload from './upload';
import moment from 'moment';
import execWithLoading from "../../../../standard-business/execWithLoading";
import {updateTable} from '../../../../standard-business/OrderTabPage/createOrderTabPageContainer'

/**
 * 功能：生成一个签署中心新增页面容器组件
 * 参数：action - [必需] 由此容器组件所在位置对应的reducer路径生成
 *       getSelfState - [必需] 获取容器组件在state对应路径下的自身节点状态
 * 返回：运单编辑页面容器组件
 * 初始化状态initState：{
 *     id - 运单标识，新增时为空
 *     isAppend - true为补录运单，默认false，为false且id不为空时跟据运单数据自动设置
 *     readonly - true为页面只读
 *     closeFunc - 页面为tab页且存在按钮操作时，操作完成后的关闭页面回调函数，无按钮操作时可无
 * }
 */

const createEditPageContainer = (action, getSelfState) => {
  const buildEditState = async ({id, closeFunc,}) => {
    try{
      let url = '/api/signature/signature_center/editConfig';
      const editConfig = getJsonResult(await fetchJson(url));
      let data = {signExpirationTime:moment().format('YYYY-MM-DD HH:mm:ss'), signPartyList: []};  //获取当前时间
      if(id){
        const url = '/api/signature/signature_center/list';
        const list = getJsonResult(await fetchJson(url, 'post'));
        for(let item of list.data){
          if(item.id === id){data = item}
        }
      }
      return {
        ...editConfig,
        valid: true,
        status: 'page',
        closeFunc,
        value: data,
      }
    }catch (e){
      helper.showError(e.message);
    }
  };

  const exitValidAction = () => {
    return action.assign({ valid: false})
  };

  const initActionCreators = () => async (dispatch, getState) => {
    const initState = getSelfState(getState()) || {};
    dispatch(action.assign({status: 'loading'}));
    const state = await buildEditState(initState);
    if(!state){
      dispatch(action.create({...initState, status: 'retry'}));
    }else{
      dispatch(action.create(state));
      if(helper.getRouteKey() === 'index'){
        let [...pageTitle] = helper.getPageTitle();
        pageTitle.push('新增');
        helper.setPageTitle(pageTitle)
      }
    }
  };

  //上传文件
  const uploadAction = async(dispatch, getState) => {
    const url = `/api/proxy/sign_center/upload_file`;
    const start = await upload(url);
    if(start){
      execWithLoading(async () => {
        const sss = await start();
        const {status, name ,response = {}} = sss;
        const fileBody = response.result;
        if(status && response.returnCode === 0){
          showSuccessMsg(`[${name}]上传成功`);
        }else{
          showError(`[${name}]上传失败`)
        }
        dispatch(action.assign({...fileBody, signFileSubject: name}, 'value'))
      })
    }
  };

  //勾选
  const checkActionCreator = (rowIndex, keyName, checked) => {
    return action.update({checked}, ['value', 'signPartyList'], rowIndex);
  };

  //输入值修改
  const changeActionCreator = (key, value) => {
    return (action.assign({[key]: value}, 'value'));
  };

  //表格内容变化
  const contentChangeAction = (rowIndex, keyName, value) => async(dispatch,getState) => {
    const {tableItems} = getSelfState(getState());
    dispatch(action.update({[keyName]: value}, ['value', 'signPartyList'], rowIndex))
  };

  //新增行
  const increaseAction = (dispatch) => {
    dispatch(action.add({}, ['value', 'signPartyList'], 0))
  };

  //删除行
  const delAction = (dispatch, getState) => {
    const {value} = getSelfState(getState());
    const newItems = value.signPartyList.filter(item => !item.checked);
    dispatch(action.assign({signPartyList: newItems}, 'value'))
  };

  //从联系人中添加
  const contactAction = async (dispatch, getState) => {
    const {contactConfig, tableItems}  = getSelfState(getState());
    const url = '/api/signature/signature_center/list';
    const json = await fetchJson(url, 'post');
    if(json.returnCode !== 0) return showError(json.returnMsg);
    const selectItems = json.result;
    const filterItems = json.result;
    const okFunc = (addItems = []) => {
      const newItems = addItems.concat(tableItems);
      dispatch(action.assign({tableItems: newItems}))
    };
    buildAddState(contactConfig, selectItems.data, filterItems.data, true, dispatch, okFunc);
    showPopup(AddDialogContainer)
  };

  //从签署群组中添加
  const groupAction = async (dispatch, getState) => {
    const {groupConfig, value} = getSelfState(getState());
    const url = '/api/signature/signature_center/groups';
    const json = await fetchJson(url, 'post');
    if(json.returnCode !== 0) return showError(json.returnMsg);
    const selectItems = value.signPartyList;
    const filterItems = json.result;
    console.log(filterItems.data)
    const okFunc = (addItems = []) => {
      const newItems = addItems.concat(selectItems);
      dispatch(action.assign({signPartyList: newItems}, 'value'))
    };
    buildAddState(groupConfig, selectItems, filterItems.data, true, dispatch, okFunc);
    showPopup(AddDialogContainer)
  };

  //刷新页面
  const upDatePage = (guid) => async (dispatch, getState) => {
    showSuccessMsg('保存成功');
    const selfState = getSelfState(getState());
    const url = '/api/signature/signature_center/list';
    const list = getJsonResult(await fetchJson(url, 'post'));
    if(!list){
      return showError(`刷新页面数据失败`)
    }
    let data;
    for(let item of list.data){
      if(item.id === guid){data = item}
    }
    const buttons4 = [
      {key: 'save', title: '保存'},
      {key: 'next',title: '签署', bsStyle: 'primary'}
    ];
    const buttons5 = [
      {key: 'save', title: '保存'},
      {key: 'send',title: '发送', bsStyle: 'primary'}
    ];
    if(data.signWay === "1"){   //签署文件
      dispatch(action.assign({value: data, buttons3:buttons4}))
    }else{
      dispatch(action.assign({value: data, buttons3: buttons5}))
    }
  };

  //保存
  const saveAction = async (dispatch, getState) => {
    const {value, controls1, controls2, tableCols} = getSelfState(getState());
    if(!validValue(controls1, value)){   //判断from1必填
      dispatch(action.assign({valid: true}));
      return
    }
    if(!validValue(controls2, value)){   //判断from2必填
      dispatch(action.assign({valid: true}));
      return
    }
    if(!validArray(tableCols, value.signPartyList.filter(item => !item.hide))){   //判断表格必填
      dispatch(action.assign({valid: true, from: false}));
      return
    }
    if(value.signPartyList.length === 0){
      showError('至少添加一个签署方');
      return
    }
    const URL_SAVE = `/api/signature/signature_center/save`;
    const postData = {
      signContractId: value.signContractId,
      id: value.id,
      isAddCcSide: value.isAddCcSide,
      note: value.note,
      isSignInSpecifiedLocation:value.isSignInSpecifiedLocation,
      signExpirationTime: value.signExpirationTime,
      signFinishTime: value.signFinishTime,
      signOrderStrategy: value.signOrderStrategy,
      signPartyList: value.signPartyList,
      signWay: value.signWay,
      signFileSubject: value.signFileSubject
      };
    const {result, returnCode, returnMsg} = await fetchJson(URL_SAVE,postOption(postData, 'post'));
    if(returnCode !== 0 ){
      showError(returnMsg);
      return
    }
    upDatePage(result.id)(dispatch, getState);
  };

  //下一步
 const nextAction = async(dispatch, getState) => {
  const {value} = getSelfState(getState());
  let id = value.id;
   const URL_SEND =  '/api/signature/signature_center/send';   //发送
  const URL_SIGN =  '/api/signature/signature_center/sign';   //签署
   const result = await helper.fetchJson(URL_SEND, helper.postOption(value));
   if (result.returnCode !== 0) return helper.showError(result.returnMsg);
   const {returnCode, returnMsg } = await helper.fetchJson(URL_SIGN, helper.postOption(id));
   if (returnCode !== 0) return helper.showError(returnMsg);
   window.open(returnMsg)
 } ;

 //发送
  const sendAction = async (dispatch, getState) => {
    const {value} = getSelfState(getState());
    let id = value.id;
    const URL_SEND =  '/api/signature/signature_center/send';
    const {returnCode, returnMsg } = await helper.fetchJson(URL_SEND, helper.postOption(value));
    if (returnCode !== 0) return helper.showError(returnMsg);
    showSuccessMsg(returnMsg)
  };



  const toolbarAction = {
    increase: increaseAction,
    del: delAction,
    contact:contactAction,
    group:groupAction,
    save: saveAction,
    next: nextAction,
    upload: uploadAction,
    send: sendAction
  };

  const clickActionCreator = (key) => {
    if (toolbarAction[key]) {
      return toolbarAction[key];
    } else {
      console.log('unknown key:', key);
      return {type: 'unknown'};
    }
  };

  const mapStateToProps = (state) => {
    return getSelfState(state);
  };

  const actionCreators = {
    onInit: initActionCreators,
    onClick: clickActionCreator,
    onCheck: checkActionCreator,
    onChange: changeActionCreator,
    onContentChange:contentChangeAction,
    onExitValid: exitValidAction
  };

  return connect(mapStateToProps, actionCreators)(EnhanceLoading(EditPage))

};

export default createEditPageContainer
