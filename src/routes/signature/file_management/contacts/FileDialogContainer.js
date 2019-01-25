import {connect} from 'react-redux';
import TreeDialog from '../../components/TreeDialog'
import {Action} from '../../../../action-reducer/action';
import showPopup from '../../../../standard-business/showPopup';
import helper from '../../../../common/common';
import Tree from '../../../../common/tree';

const action = new Action(['temp'], false);


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
  const {tree,select,parents,handleTree} = getSelfState(getState());

  if(!select){
    return
  }
  //最多新增3层，根据父节点判断是否大于3层
  const parent = Number(tree[select].parent.split('-')[0]);
  for(let key in tree){
    if(tree[key].edit === 'add'){
      helper.showError('当前有正在新增的，不能继续新增');
      return
    }
  }

  console.log(tree);
  return

  // if(parent >= 2){
  //   helper.showError('最多创建3层树状结构');
  //   return
  // }
  //
  // let newHandleTree = helper.deepCopy(handleTree);
  //
  // if(select !== '1-0'){
  //   for(let treeData of newHandleTree){
  //     if(treeData.title === tree[select].title){
  //       !treeData.children && (treeData.children = []);
  //       treeData.children.push({edit:'add'})
  //     }
  //   }
  // }else {
  //   newHandleTree.push({edit:'add'})
  // }
   //生成树结构
  const newTree = Tree.createWithInsertRoot(newHandleTree,'全部文件', {guid: 'root', districtType:0});
  let treeKey,treeParent;
  //展开树
  for(let key in newTree){
    if(newTree[key].edit === 'add'){
      treeKey = newTree[key].key;
      treeParent = newTree[key].parent;
    }else if(typeof newTree[key] === 'object'){
      newTree[key].disabled = true;
    }
  }
  dispatch(action.assign({tree:newTree,handleTree:newHandleTree,select:treeKey}));
  dispatch( action.assign({[treeParent]: true}, 'expand'))
};

const delActionCreator = () => async (dispatch, getState) => {
  const {tree,select,parents,handleTree} = getSelfState(getState());
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

  dispatch(action.assign({tree:newTree}))
};

const editActionCreator = () => async (dispatch, getState) => {
  const {tree,select,parents,handleTree} = getSelfState(getState());
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
  dispatch(action.assign({visible: false, ok: false}));
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
  const {tree,value,handleTree} = getSelfState(getState());
  console.log(handleTree);
  const newTree = helper.deepCopy(tree);
  for(let key in newTree){
    //全部改为可以点击
    typeof newTree[key] === 'object' && (newTree[key].disabled = false);
    //删除edit 为add
    if(newTree[key].edit === 'add'){
      newTree[key].edit = false;
      let parent = newTree[newTree[key].parent];
      parent.children = parent.children.filter(item => item !== key);
      delete newTree[key]
    }else if(newTree[key].edit){
      newTree[key].edit = false;
    }
  }
  dispatch(action.assign({tree:newTree,value:{}}))
};

const onOkActionCreator = (key) => async (dispatch, getState) => {
  const {tree,value} = getSelfState(getState());
  const newTree = helper.deepCopy(tree);
  let result;
  switch (newTree[key].edit){
    case 'add':{
      break;
    }
    case 'edit':{
      break;
    }
    case 'del':{
      break;
    }
    default:
      return
  }

  for(let key in newTree){
    //全部改为可以点击
    typeof newTree[key] === 'object' && (newTree[key].disabled = false);
    //删除edit 为add
    if(newTree[key].edit === 'add'){
      newTree[key].edit = false;
      let parent = newTree[newTree[key].parent];
      parent.children = parent.children.filter(item => item !== key);
      delete newTree[key]
    }else if(newTree[key].edit){
      newTree[key].edit = false;
    }
  }
  dispatch(action.assign({tree:newTree,value:{},select:null}))
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
