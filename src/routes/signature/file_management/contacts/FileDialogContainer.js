import {connect} from 'react-redux';
import TreeDialog from '../../components/TreeDialog'
import {Action} from '../../../../action-reducer/action';
import showPopup from '../../../../standard-business/showPopup';
import helper from '../../../../common/common';
import Tree from '../../../../common/tree';

const action = new Action(['temp'], false);

const URL_TREE_LIST = '/api/signature/file_management/contacts/tree' ;//获取树
const URL_ADD = '/api/signature/file_management/contacts/addGroup' ;//新增树
const URL_EDIT = '/api/signature/file_management/contacts/editGroup' ;//编辑树
const URL_DEL = '/api/signature/file_management/contacts/delGropp' ;//删除树

const getSelfState = (state) => {
  return state.temp || {};
};

const buildState = (config,treeData={},handleTree,title,footer) => {
  const key = Tree.getRootKey(treeData);
  return {
    ...config,
    title,
    visible:true,
    tree:treeData,
    select: key,
    parents:null,
    handleTree,
    expand: {[key]: true},
    value:{},
    footer
  };
};



const checkActionCreator = (isAll, checked, rowIndex) => {
  isAll && (rowIndex = -1);
  return action.update({checked}, 'items', rowIndex);
};

const addActionCreator = () => async (dispatch, getState) => {
  try {
    //获取树结构为 {title:'',children:[]}
    const {tree} = getSelfState(getState());
    for(let k in tree){
      if(tree[k].edit){
        helper.showError('当前有正在变更的节点')
        return
      }
    }
    const treeData = helper.getJsonResult(await helper.fetchJson(URL_TREE_LIST));
    treeData.push({edit:'add'});
    //生成树结构
    const newTree = Tree.createWithInsertRoot(treeData,'全部文件', {guid: 'root', districtType:0});
    dispatch(action.assign({tree:newTree}));
  }catch (e){
    helper.showError(e.message)
  }
};

const delActionCreator = () => async (dispatch, getState) => {
  const {tree,select,parents,handleTree} = getSelfState(getState());
  for(let k in tree){
    if(tree[k].edit){
      helper.showError('当前有正在变更的节点')
      return
    }
  }
  const newTree = helper.deepCopy(tree);
  const data = newTree[select];
  if(select === '1-0'){
    helper.showError('根节点不能删除');
    return
  }else if(data.children && data.children.length > 0 ){
    helper.showError('存在子节点不能删除');
    return
  }

  data.edit = 'del';
  //禁止别的节点点击
  for(let key in newTree){
    if(!newTree[key].edit && typeof newTree[key] === 'object'){
      newTree[key].disabled = true;
    }
  }

  dispatch(action.assign({tree:newTree,value:{del:tree[select]}}))
};

const editActionCreator = () => async (dispatch, getState) => {
  const {tree,select,parents,handleTree} = getSelfState(getState());
  for(let k in tree){
    if(tree[k].edit){
      helper.showError('当前有正在变更的节点')
      return
    }
  }
  const newTree = helper.deepCopy(tree);
  const data = newTree[select];
  if(select === '1-0'){
    helper.showError('根节点不能编辑');
    return
  }
  data.edit = 'edit';
  //禁止别的节点点击
  for(let key in newTree){
    if(!newTree[key].edit && typeof newTree[key] === 'object'){
      newTree[key].disabled = true;
    }
  }
  dispatch(action.assign({tree:newTree}))
};

const closeActionCreator = () => (dispatch) => {
  dispatch(action.assign({visible: false, ok: true}));
};

const clickActionCreators = {
  del:delActionCreator,
  edit:editActionCreator,
  add:addActionCreator,
  close: closeActionCreator
};


//展开or关闭
const expandActionCreator = (key, expand) => {
  return action.assign({[key]: expand}, 'expand');
};

//选择树
const selectActionCreator = (key) => async (dispatch, getState) => {
  const {tree} = getSelfState(getState());
  if(key !== '1-0'){
    dispatch(action.assign({ select: key,parents:{title:tree[key].title,value:tree[key].value}}));
  }else {
    dispatch(action.assign({select: key,parents:null}));
  }
};


const onChangeActionCreator = (keyValue,keyName) => async (dispatch, getState) => {
  dispatch(action.assign({[keyName]: keyValue}, 'value'));
};

const onCancelActionCreator = (key) => async (dispatch, getState) => {
  const treeData = helper.getJsonResult(await helper.fetchJson(URL_TREE_LIST));
  //生成树结构
  const newTree = Tree.createWithInsertRoot(treeData,'全部文件', {guid: 'root', districtType:0});
  dispatch(action.assign({tree:newTree,value:{},select: '1-0'}));
  dispatch( action.assign({['1-0']: true}, 'expand'))
};

function Trim(str)
{
  return str.replace(/(^\s*)|(\s*$)/g, "");
}

const onOkActionCreator = (key) => async (dispatch, getState) => {
  const {tree,value,select} = getSelfState(getState());
  let body = {};
  for(let v in value){
    body.companyContactGroupName = value[v];
  }
  //校验是否为空
  if(JSON.stringify(body) == "{}" || !body.companyContactGroupName){
    helper.showError('不能为空');
    return
  }

  let url,postBody;
  switch (tree[key].edit){
    case 'add':{
      postBody = helper.postOption(body) ;
      url = URL_ADD;
      break;
    }
    case 'edit':{
      body.id = tree[select].value;
      postBody = helper.postOption(body,'put') ;
      url = URL_EDIT;
      break;
    }
    case 'del':{
      const id =  body.companyContactGroupName.value;
      url = `${URL_DEL}/${id}`;
      postBody = 'delete';
      break;
    }
    default:
      return
  }
  const {returnCode,returnMsg} = await helper.fetchJson(url,postBody);
  if(returnCode!==0){
    helper.showError(returnMsg);
    return
  }
  //获取树结构为 {title:'',children:[]}
  const treeData = helper.getJsonResult(await helper.fetchJson(URL_TREE_LIST));
  //生成树结构
  const newTree = Tree.createWithInsertRoot(treeData,'全部文件', {guid: 'root', districtType:0});
  dispatch(action.assign({tree:newTree,value:{},select: '1-0'}));
};

const clickActionCreator = (key) => {
  if (clickActionCreators.hasOwnProperty(key)) {
    return clickActionCreators[key]();
  } else {
    return {type: 'unknown'};
  }
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onCheck: checkActionCreator,
  onClick: clickActionCreator,
  onExpand: expandActionCreator,
  onSelect: selectActionCreator,
  onChange: onChangeActionCreator,
  onCancel: onCancelActionCreator,
  onOk: onOkActionCreator
};

export default async (config, items,handleTree,title,footer = false) => {
  const Container = connect(mapStateToProps, actionCreators)(TreeDialog);
  global.store.dispatch(action.create(buildState(config, items,handleTree,title,footer)));
  await showPopup(Container, {}, true);

  const state = getSelfState(global.store.getState());
  global.store.dispatch(action.create({}));
  return state.ok;
};
