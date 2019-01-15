import { connect } from  'react-redux';
import EditPage from './EditPage';
import {EnhanceLoading} from '../../../../components/Enhance';
import {fetchJson, getJsonResult, showError, showSuccessMsg} from "../../../../common/common";
import {fetchAllDictionary, setDictionary2} from "../../../../common/dictionary";
import helper from '../../../../common/common';
import showPopup from '../../../../standard-business/showPopup';
import AddDialogContainer, {buildAddState} from './AddDialog/AddDialogContainer';
import upload from './upload';
import execWithLoading from "../../../../standard-business/execWithLoading";

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
  const getCurrentDate = () => {
    const date = new Date;
    const d = date.getDate();
    const dd = d < 10 ? `0${d}` : String(d);
    const m = date.getMonth()+1;
    const mm = m < 10 ? `0${m}` : String(m);
    const yyyy = date.getFullYear().toString();
    const h = date.getHours();
    const hh = h < 10 ? `0${h}` : String(h);
    const f = date.getMinutes();
    const ff = f < 10 ? `0${f}` : String(f);
    const s = date.getSeconds();
    const ss = s < 10 ? `0${s}` : String(s);
    return `${yyyy}-${mm}-${dd} ${hh}:${ff}:${ss}`;
  };

  const buildEditState = async ({id, closeFunc,}) => {
    try{
      let url = '/api/signature/signature_center/editConfig';
      const editConfig = getJsonResult(await fetchJson(url));
      if(id){
        const url = '/api/signature/signature_center/list';
        const list = getJsonResult(await fetchJson(url));
      }
      return {
        ...editConfig,
        valid: {},
        status: 'page',
        closeFunc,
        tableItems: []
      }
    }catch (e){
      helper.showError(e.message);
    }
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

  //勾选
  const checkActionCreator = (rowIndex, keyName, checked) => {
    return action.update({checked}, 'tableItems', rowIndex);
  };

  //输入值修改
  const changeActionCreator = (key, value) => {
    return (action.assign({[key]: value}, 'value'));
  };

  //表格内容变化
  const contentChangeAction = (rowIndex, keyName, value) => async(dispatch,getState) => {
    const {tableItems} = getSelfState(getState());
    dispatch(action.update({[keyName]: value}, 'tableItems', rowIndex))
  };

  //新增行
  const increaseAction = (dispatch) => {
    dispatch(action.add({}, 'tableItems', 0))
  };

  //删除行
  const delAction = (dispatch, getState) => {
    const {tableItems} = getSelfState(getState());
    const newItems = tableItems.filter(item => !item.checked);
    dispatch(action.assign({tableItems: newItems}))
  };

  //从联系人中添加
  const contactAction = async (dispatch, getState) => {
    const {contactConfig, tableItems}  = getSelfState(getState());
    const url = '/api/signature/signature_center/list';
    const json = await fetchJson(url);
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
    const {groupConfig, tableItems} = getSelfState(getState());
    const url = '/api/signature/signature_center/list';
    const json = await fetchJson(url);
    if(json.returnCode !== 0) return showError(json.returnMsg);
    const selectItems = [];
    const filterItems = [];
    const okFunc = (addItems = []) => {
      const newItems = addItems.concat(tableItems);
      dispatch(action.assign({tableItems: newItems}))
    };
    buildAddState(groupConfig, selectItems.data, filterItems.data, true, dispatch, okFunc);
    showPopup(AddDialogContainer)
  };

  //保存
  const saveAction = async (dispatch, getState) => {

  };

  //下一步
 const nextAction = async(dispatch, getState) => {

 } ;

 //上传文件
  const uploadAction = async(dispatch, getState) => {
    const url = `api/proxy/zuul/`;
    const start = await upload(url);
    if(start){
      execWithLoading(async () => {
        const sss = await start();
        const {status, name ,response = {}} = sss;
        if(status && response.returnCode === 0){
          showSuccessMsg(`[${name}]上传成功`);
        }else{
          showError(`[${name}]上传失败`)
        }
      })
    }
  };



  const toolbarAction = {
    increase: increaseAction,
    del: delAction,
    contact:contactAction,
    group:groupAction,
    save: saveAction,
    next: nextAction,
    upload: uploadAction
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
    onContentChange:contentChangeAction
  };

  return connect(mapStateToProps, actionCreators)(EnhanceLoading(EditPage))

};

export default createEditPageContainer
