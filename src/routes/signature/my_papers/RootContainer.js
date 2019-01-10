import {connect} from 'react-redux';
import TreePage from '../components/TreePage';
import {EnhanceLoading,} from '../../../components/Enhance';
import helper from '../../../common/common';
import Tree from '../../../common/tree';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import showTreeDialog from './FileDialogContainer'


const STATE_PATH = ['my_papers'];
const action = new Action(STATE_PATH);

const URL_LIST = '/api/signature/my_papers/list';
const URL_CONFIG = '/api/signature/my_papers/config';
const URL_TREE_LIST = '/api/signature/my_papers/tree';

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const buildState = async(config, treeData=[]) => {
  const tree = Tree.createWithInsertRoot(treeData,config.root, {guid: 'root', districtType:0});
  const key = Tree.getRootKey(tree);
  //子列表
  //const list = helper.getJsonResult(await helper.fetchJson(URL_LIST));
  return {
    ...config.index,
    tree,
    select: key,
    parents:null,
    expand: {[key]: true},
    tableItems: [],
    editConfig: config.file,
  };
};

//树结构 id，pid处理为{title,value,children}
const convertToTree = (data, pid) => {
  let result = [], temp;
  for (let i = 0; i < data.length; i++) {
    if ((!pid && !data[i].pid) || (data[i].pid && data[i].pid.value === pid)) {
      let obj = {title: data[i].id.title, value: data[i].id.value};
      temp = convertToTree(data, data[i].id.value);
      if (temp.length > 0) {
        obj.children = temp;
      }
      result.push(obj);
    }
  }
  return result;
};

const initActionCreator = () => async (dispatch) => {
  try{
    dispatch(action.assign({status: 'loading'}));
    const config = helper.getJsonResult(await helper.fetchJson(URL_CONFIG));
    //获取树
    const items = helper.getJsonResult(await helper.fetchJson(URL_TREE_LIST));
    //树结构 id，pid处理为{title,value,children}
    const tree = convertToTree(items.result);



    const payload = await buildState(config, tree);

    payload.status = 'page';
    payload.allItems = items.result;
    payload.handleTree = tree;

    dispatch(action.create(payload));

  }catch (e){
    helper.showError(e.message);
    dispatch(action.assign({status: 'retry'}));
  }
};


const inputChangeActionCreator = (value) => {
  return action.assign({inputValue: value});
};

const fileAction = () =>  async (dispatch, getState) => {
  const {editConfig,tree,handleTree} = getSelfState(getState());
  if (await showTreeDialog(editConfig,tree,handleTree,'管理文件夹')) {
  }
};

const moveAction = () =>  async (dispatch, getState) => {
  const {editConfig,tree,handleTree} = getSelfState(getState());
  if (await showTreeDialog(editConfig,tree,handleTree,'移动文件夹',true)) {
  }
};


// 在树中搜索字典名称(模糊搜索)
const searchAction = () =>  (dispatch, getState) => {
  const {allItems, tree, inputValue} = getSelfState(getState());
  if (inputValue) {
    const indexTableItems = allItems.filter(item => item.id.title.includes(inputValue));
    dispatch(action.assign({searchValue: inputValue, expand: Tree.search(tree, inputValue), indexTableItems}));
  } else {
    dispatch(action.assign({searchValue: inputValue, indexTableItems: allItems}));
  }
};

const clickActionCreators = {
  file: fileAction,
  move: moveAction,
  search: searchAction,

};

const clickActionCreator = (key) => {
  if (clickActionCreators.hasOwnProperty(key)) {
    return clickActionCreators[key]();
  } else {
    return {type: 'unknown'};
  }
};

const checkActionCreator = (isAll, checked, rowIndex) => {
  const index = isAll ? -1 : rowIndex;
  return action.update({checked}, 'tableItems', index);
};

//展开or关闭
const expandActionCreator = (key, expand) => {
  return action.assign({[key]: expand}, 'expand');
};

//选择树
const selectActionCreator = (key) => async (dispatch, getState) => {


};

const onLinkActionCreator = (key, rowIndex, item)  => async (dispatch,getState) => {

};



const actionCreators = {
  onInit: initActionCreator,
  onInputChange: inputChangeActionCreator,
  onClick: clickActionCreator,
  onCheck: checkActionCreator,
  onExpand: expandActionCreator,
  onSelect: selectActionCreator,
  onLink: onLinkActionCreator
};


const mapStateToProps = (state) => {
  return getSelfState(state);
};

const Container = connect(mapStateToProps, actionCreators)(EnhanceLoading(TreePage));
export default Container;
