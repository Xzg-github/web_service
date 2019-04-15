import { connect } from 'react-redux';
import { Action } from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {search2} from '../../../common/search';
import helper, {fetchJson, showError} from '../../../common/common';
import { getObject } from '../../../common/common';
import createOrderTabPageContainer, {buildOrderTabPageCommonState, updateTable} from "../../../standard-business/OrderTabPage/createOrderTabPageContainer";
import ShowPageContainer,{buildShowState} from "./ShowPageContainer/ShowPageContainer";
import showPopup from '../../../standard-business/showPopup';
import showDiaLog from './showDiaLog/AddDialogContainer';
import {jump} from '../../../components/Link';

const URL_CONFIG = '/api/signature/signature_center/config';
const urlList = '/api/signature/signature_center/list';
const urlPerson = '/api/signature/signature_center/personAuthentication'; //个人认证

const STATE_PATH = ['signature_center'];
const action = new Action(STATE_PATH);
const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

//创建主列表状态
const buildOrderTabPageState = async () => {
  const statusNames = ['order_type'];
  return buildOrderTabPageCommonState(URL_CONFIG, urlList, statusNames)
};

//构建新增编辑页面状态
const showOrderInfoPage = (dispatch, item, selfState, edit) => {
  const key = item.id ? item.id : 'add';
  const title = edit? item.signFileSubject || '编辑' : '新增';
  if(helper.isTabExist(selfState.tabs,key)){
    dispatch(action.assign({activeKey: key}))
  }else{
    const closeFunc = () => {
      const newTabs = selfState.tabs.filter(tab => tab.key !== key);
      dispatch(action.assign({tabs: newTabs, [key]: undefined, activeKey: 'index'}));
      return updateTable(dispatch, action, selfState, ['mySign', 'hisSign', 'draft', 'other']);
    };
    const payload = {
      id: item.id,
      closeFunc
    };
    dispatch(action.add({key, title}, 'tabs'));
    dispatch(action.assign({[key]: payload, activeKey: key}));
  }
};

//新增
const addAction  = (tabKey) => async (dispatch, getState) => {
  const URL_CREATE = `/api/signature/signature_center/create`;
  const {returnCode, returnMsg, result} = await fetchJson(URL_CREATE, 'get');
  if(result !== 1){
    showError(returnMsg);
    return
  }
  const selfState = getSelfState(getState());
  showOrderInfoPage(dispatch, {}, selfState, false)
};

//编辑
const editAction = (tabKey) => async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const checkedItems = tableItems[tabKey].filter(item => item.checked === true);
  if(checkedItems.length !== 1)return helper.showError('请勾选一条记录');
  return showOrderInfoPage(dispatch, checkedItems[0], getSelfState(getState()), true)
};

//删除
const delAction = (tabKey) => async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const URL_DEL =  '/api/signature/signature_center/del';
  const ids = tableItems[tabKey].filter(item => item.checked === true).map(item => item.id);
  if(ids.length < 1) return helper.showError('请先勾选要删除的记录');
  const {returnCode, returnMsg} = await helper.fetchJson(URL_DEL, helper.postOption(ids, 'post'));
  if(returnCode !== 0)return helper.showError(returnMsg);
  return updateTable(dispatch, action, getSelfState(getState()));
};

//签署
const signatureAction = (tabKey) => async (dispatch, getState) =>{
  const {tableItems} = getSelfState(getState());
  const checkedItems = tableItems[tabKey].filter(item => item.checked === true);
  if(checkedItems.length !== 1)return helper.showError('请勾选一条记录');
  const id = checkedItems[0].id;
  const URL_SIGN =  '/api/signature/signature_center/sign';
  const {returnCode, returnMsg, result } = await helper.fetchJson(URL_SIGN, helper.postOption(id));
  console.log(result)
  if (returnCode !== 0) return helper.showError(returnMsg);
  //window.open(result);
   var timer=""
   layer.open({
      type: 2,
      title: '请签署',
      //shadeClose: true,
      //shade: false,
      maxmin: true, //开启最大化最小化按钮
      area: [($(window).width()-50)+'px', ($(window).height()-50)+'px'],
      content: result
	  //,btn: ['返回']
	  //,btnAlign: 'l'
	  /*,yes: function(index, layero){
		updateTable(dispatch, action, getSelfState(getState()));
		layer.close(index)
	 }*/
	 ,cancel: function(){
		clearInterval(timer)
      //右上角关闭回调
		updateTable(dispatch, action, getSelfState(getState()));
      
     }
	 ,success: function(layero, index){
		 timer=setInterval(function(){
			 
			var body = layer.getChildFrame('body', index);
			var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
			var t = iframeWin.document.getElementById("time")
			if (typeof (t) == "undefined" || t === undefined || t==null) {
				return
			}	
			var timeE = t.innerHTML
			console.log(timeE) //得到iframe页的body内容
			if(timeE==""){
				clearInterval(timer)
				updateTable(dispatch, action, getSelfState(getState()));
				layer.close(index)
			}
		 },500);

	  }
    });
	
	
};

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


// link详情查看
const onLinkActionCreator = (tabKey, key, rowIndex, item) => async (dispatch, getState) => {
  const {showConfig, tableItems} = getSelfState(getState());
  let token = getCookie('token');
  const URL_RECORD = `/api/signature/signature_center/record`;
  const URL_ACCOUNT = '/api/signature/signature_center/getName'; //当前登陆人信息
  const items = tableItems[tabKey][rowIndex];
  const {returnCode, returnMsg, result} = await helper.fetchJson(`${URL_RECORD}/${items.id}`);
  if(returnCode !==0){return showError(returnMsg)}
  const user = await fetchJson(`${URL_ACCOUNT}/${token}`,'get');
  if(user.returnCode !== 0) {return showError(user.returnMsg)}
  const title = items.signFileSubject || '签署详情';
  const closeFunc = () => {
    return updateTable(dispatch, action, getSelfState(getState()), ['mySign', 'hisSign', 'draft', 'other']);
  };
  buildShowState(showConfig, result, dispatch, title, user, closeFunc);
  showPopup(ShowPageContainer);
};

//下载模板
const uploadActionCreator = (tabKey) => async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const checkedItems = tableItems[tabKey].filter(item => item.checked === true);
  if(checkedItems.length !== 1)return helper.showError('请勾选一条记录');
  const URL_DOWNLOAD= checkedItems[0].urlOfSignedFileDownload;  // 点击下载
  if(!URL_DOWNLOAD){
    helper.showError('请先完成签署操作！');
    return
  }
    helper.download(URL_DOWNLOAD,'file');
};

//在线预览
const linePreviewAction = (tabKey) => async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const checkedItems = tableItems[tabKey].filter(item => item.checked === true);
  if(checkedItems.length !== 1){return helper.showError('请勾选一条记录')}
  const URL_VIEW = checkedItems[0].urlOfSignedFileViewpdf;
  if(!URL_VIEW){
    helper.showError('请先完成签署操作！');
    return
  }
  window.open(URL_VIEW)
};


const toolbarActions = {
  add: addAction,
  edit: editAction,
  signature:signatureAction,
  del: delAction,
  upload: uploadActionCreator,
  view: linePreviewAction
};

const clickActionCreator = (tabKey, key) => {
  if (toolbarActions[key]) {
    return toolbarActions[key](tabKey);
  } else {
    console.log('unknown key:', key);
    return {type: 'unknown'};
  }
};


// 认证
//企业登录 弹出modal，个人登录跳转去个人认证
const url = '/api/signature/signature_center/authentication';
const onAuthenticationActionCreator = () => async(dispatch, getState) => {
  const {role,authenticationState} = getSelfState(getState());

  if(role === 'econtract_personal_role'){
    const {result,returnCode,returnMsg} =await helper.fetchJson(urlPerson);
    if(returnCode !== 0) {
      helper.showError(returnMsg);
      return
    }
    window.open(result);
    return
  }

  if(authenticationState == 2){
    const {result,returnCode,returnMsg} =await helper.fetchJson(url,helper.postOption({}));
    if(returnCode !== 0) {
      helper.showError(returnMsg);
      return
    }
    window.open(result);
    return
  }

  const options = [
    {value:1,title:'法人'},
    {value:2,title:'代理人'},
  ];

  const controls = [
    {key:'companyPrincipalType',title:'企业负责人信息 ',type:'select',options,required:true},
    {key:'name',title:'法人信息',type:'text',required:true},
  ];
  if (await showDiaLog(controls, {} ,false)) {
  }
};


const actionCreators = {
  onClick: clickActionCreator,
  onLink: onLinkActionCreator,
  onAuthentication:onAuthenticationActionCreator
};

export default createOrderTabPageContainer(action, getSelfState, actionCreators);
export {buildOrderTabPageState};
