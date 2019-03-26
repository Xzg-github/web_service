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


export const getCookie = (cookieName) =>{
  let strCookie = document.cookie;
  let arrCookie = strCookie.split("; ");
  for(let i = 0; i < arrCookie.length; i++){
    let arr = arrCookie[i].split("=");
    if(cookieName === arr[0]){
      return arr[1];
    }
  }
  return "";
};

const createEditPageContainer = (action, getSelfState, getTempState) => {
  const buildEditState = async ({id, closeFunc,}) => {
    try{
      let url = '/api/signature/signature_center/editConfig';
      const editConfig = getJsonResult(await fetchJson(url));
      let data = {signPartyList: []};
      //let data = {signExpirationTime:moment().format('YYYY-MM-DD HH:mm:ss'), signPartyList: []};  //获取当前时间
      if(id){
        const URL_LIST_ONE = '/api/signature/signature_center/getOne';
        const list = getJsonResult(await fetchJson(`${URL_LIST_ONE}/${id}`,'get'));
          data = list;
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
    const url = `/api/proxy/fadada-service/sign_center/upload_file`;
    const start = await upload(url);
    if(start){
      execWithLoading(async () => {
        const sss = await start();
        const {status, name ,response = {}} = sss;
        const fileBody = response.result;
        if(status && response.returnCode === 0){
          showSuccessMsg(`[${name}]上传成功`);
        }else{
          return showError(`[${name}]上传失败`)
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
  const changeActionCreator = (key, values) => async(dispatch, getState) => {
    const {value} = getSelfState(getState());
    let token = getCookie('token');
    const URL_ACCOUNT = '/api/signature/signature_center/getName';
    let list = value.signPartyList;
    if(key === 'signWay' && values === '1'){
      const {returnCode, returnMsg, result} = await fetchJson(`${URL_ACCOUNT}/${token}`,'get');
      if(returnCode !== 0) return;
      const account = result.account;
      const email = result.userEmail;
      const signPartyName = result.username;
      if(JSON.stringify(list).indexOf(JSON.stringify(email))===-1){
        list.unshift({account:email, signPartyName, sequence: 1, readonly: true});
      }
      dispatch(action.assign({signPartyList: list}, 'value'))
    }else if(key === 'signWay' && values === '0'){
      dispatch(action.assign({signPartyList: []}, 'value'))
    }
    dispatch (action.assign({[key]: values}, 'value'));
  };

  //表格内容变化
  const contentChangeAction = (rowIndex, keyName, value) => async(dispatch,getState) => {
    dispatch(action.update({[keyName]: value}, ['value', 'signPartyList'], rowIndex))
  };

  //新增行
  const increaseAction = (dispatch, getState) => {
    const {value} = getSelfState(getState());
    if(!value.signWay){ return showError('请先选择签署方式');}
    dispatch(action.add({}, ['value', 'signPartyList']))
  };

  //删除行
  const delAction = (dispatch, getState) => {
    const {value} = getSelfState(getState());
    const items = value.signPartyList.filter(item => item.checked);
    if(value.signWay === '1' && items[0].readonly === true){
      return showError('签署方式为签署文件时，第一条记录不可被删除！')
    }
    const newItems = value.signPartyList.filter(item => !item.checked);
    dispatch(action.assign({signPartyList: newItems}, 'value'))
  };


  //从联系人中添加
  const contactAction = async (dispatch, getState) => {
    const {contactConfig, value}  = getSelfState(getState());
    const {tableItems}  = getTempState(getState());
    if(!value.signWay){ return showError('请先选择签署方式');}
    const url = '/api/signature/signature_center/name';
    const json = await fetchJson(url, 'post');
    if(json.returnCode !== 0) return showError(json.returnMsg);
    const selectItems = json.result;
    const filterItems = json.result;
    const okFunc = (addItems = []) => {
      dispatch(action.assign({signPartyList: addItems}, 'value'))
    };
    buildAddState(contactConfig, filterItems, selectItems, true, dispatch, okFunc);
    showPopup(AddDialogContainer)
  };

  //从签署群组中添加
  const groupAction = async (dispatch, getState) => {
    const {groupConfig, value} = getSelfState(getState());
    if(!value.signWay){return showError('请先选择签署方式')}
    const url = '/api/signature/signature_center/groups';
    const json = await fetchJson(url, 'post');
    if(json.returnCode !== 0) return showError(json.returnMsg);
    const selectItems = json.result;
    const filterItems = json.result;
    const okFunc = (addItems = []) => {
      dispatch(action.assign({signPartyList: addItems}, 'value'))
    };
    buildAddState(groupConfig, filterItems, selectItems, true, dispatch, okFunc);
    showPopup(AddDialogContainer)
  };

  //刷新页面
  const upDatePage = (guid) => async (dispatch, getState) => {
    showSuccessMsg('保存成功');
    const selfState = getSelfState(getState());
    const URL_LIST_ONE = '/api/signature/signature_center/getOne';
    const list = getJsonResult(await fetchJson(`${URL_LIST_ONE}/${guid}`,'get'));
    if(!list){
      return showError(`刷新页面数据失败`)
    }
    dispatch(action.assign({value: list}))
  };

  //保存
  const saveAction = async (dispatch, getState) => {
    const {value, closeFunc} = getSelfState(getState());
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
    closeFunc && closeFunc();
    upDatePage(result.id)(dispatch, getState);
  };

  //下一步
 const nextAction = async(dispatch, getState) => {
   try {
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

     const URL_SAVE = `/api/signature/signature_center/save`;      //保存
     const URL_SUBMIT = '/api/signature/signature_center/sub';  //提交
     const URL_SIGN =  '/api/signature/signature_center/sign';   //签署

     const save = helper.getJsonResult(await fetchJson(URL_SAVE,postOption(value, 'post')));  //先保存
     const submit = await fetchJson(`${URL_SUBMIT}/${save.id}`, 'get');   //再提交
     if(submit.returnCode !== 0){
       showError(submit.returnMsg);
       return
     }
     const {returnCode, returnMsg, result } = await helper.fetchJson(URL_SIGN, helper.postOption(save.id)); //签署
     if (returnCode !== 0) return helper.showError(returnMsg);
     window.open(result);
   }catch (e){
     helper.showError(e.message)
   }
 } ;

 //发送
  const sendAction = async (dispatch, getState) => {
    try {
      const {value, closeFunc} = getSelfState(getState());
      let id = value.id;
      const URL_SAVE = `/api/signature/signature_center/save`;      //保存
      const URL_SUBMIT = '/api/signature/signature_center/sub';  //提交

      const save = helper.getJsonResult(await fetchJson(URL_SAVE,postOption(value, 'post')));  //先保存
      const submit = await fetchJson(`${URL_SUBMIT}/${save.id}`, 'get');   //再提交
      if(submit.returnCode !== 0){
        showError(submit.returnMsg);
        return
      }
      showSuccessMsg(submit.returnMsg);
      closeFunc && closeFunc();                   //发送成功后关闭当前页
    }catch (e){
      helper.showError(e.message)
    }
  };

  //关闭
  const closeAction = async(dispatch, getState) => {
    const {closeFunc} = getSelfState(getState());
    closeFunc && closeFunc();
  };



  const toolbarAction = {
    increase: increaseAction,
    del: delAction,
    contact:contactAction,
    group:groupAction,
    save: saveAction,
    next: nextAction,
    upload: uploadAction,
    send: sendAction,
    close: closeAction
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
