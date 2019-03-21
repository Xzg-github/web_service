import {connect} from 'react-redux';
import TreePage from '../../components/TreePage';
import {EnhanceLoading,} from '../../../../components/Enhance';
import helper from '../../../../common/common';
import Tree from '../../../../common/tree';
import {Action} from '../../../../action-reducer/action';
import {getPathValue} from '../../../../action-reducer/helper';
import showTreeDialog from './FileDialogContainer'
import showDialog from './EdiltDialogContainer';
import showStaffDialog from '../../enterprise_documents/StaffDialogContainer';
import {toFormValue} from '../../../../common/check';
import {search2} from '../../../../common/search';


const STATE_PATH = ['contacts'];
const action = new Action(STATE_PATH);

const URL_LIST = '/api/signature/file_management/contacts/list';
const URL_CONFIG = '/api/signature/file_management/contacts/config';
const URL_TREE_LIST = '/api/signature/file_management/contacts/tree';
const URL_DEL = '/api/signature/file_management/contacts/delPerson'; //删除员工
const URL_DROP = '/api/signature/file_management/contacts/dropGroup'; //分组下拉

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

//刷新表格
const updateTable = async(dispatch,getState)  =>{
  const {currentPage, pageSize, searchData} = getSelfState(getState());
  return search2(dispatch, action, URL_LIST, currentPage, pageSize, toFormValue(searchData));
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
    addConfig: config.edit,
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
    const tree = helper.getJsonResult(await helper.fetchJson(URL_TREE_LIST));
    //树结构 id，pid处理为{title,value,children}
    //const tree = convertToTree(items.result);

    const payload = await buildState(config, tree);

    payload.status = 'page';
    payload.allItems = tree;
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

const delAction = () =>  async (dispatch, getState) => {
  const { tableItems } = getSelfState(getState());
  const index = helper.findOnlyCheckedIndex(tableItems);
  if (index === -1) {
    helper.showError('请勾选一条记录进行删除');
    return;
  }
  const id = tableItems[index].id;
  const {returnCode ,returnMsg} = await helper.fetchJson(`${URL_DEL}/${id}`,'delete');
  if(returnCode !== 0 ){
    helper.showError(returnMsg);
    return
  }
  helper.showSuccessMsg(returnMsg);
  return updateTable(dispatch, getState)

};


// 在树中搜索字典名称(模糊搜索)
const searchTreeAction = () =>  (dispatch, getState) => {
  const {allItems, tree, inputValue} = getSelfState(getState());
  if (inputValue) {
    const indexTableItems = allItems.filter(item => item.id.title.includes(inputValue));
    dispatch(action.assign({searchValue: inputValue, expand: Tree.search(tree, inputValue), indexTableItems}));
  } else {
    dispatch(action.assign({searchValue: inputValue, indexTableItems: allItems}));
  }
};

const addActionCreator = () => async (dispatch, getState) => {
  const { addConfig,searchData } = getSelfState(getState());
  let body = {};
  if(searchData.companyContactGroupId){
    body.companyContactGroupId = searchData.companyContactGroupId
  }

  if (await showDialog(addConfig, {...body} ,false)) {
    await updateTable(dispatch,getState)
  }
};


const editActionCreator = () => async (dispatch, getState) => {
  const { tableItems , addConfig} = getSelfState(getState());
  const index = helper.findOnlyCheckedIndex(tableItems);
  if (index === -1) {
    helper.showError('请勾选一条记录进行编辑');
    return;
  }
  if (await showDialog(addConfig, {...tableItems[index]} ,true)) {
    await updateTable(dispatch,getState)
  }
};

const staffActionCreator = () => async (dispatch, getState) => {
  if (await showStaffDialog()) {
  }
};

const searchClickActionCreator = () => async (dispatch, getState) => {
  const {searchData} = getSelfState(getState());
  return updateTable(dispatch,getState,helper.convert(searchData))
};

const resetActionCreator = () => (dispatch,getState) =>{
  const {searchData} = getSelfState(getState());
  if(searchData.companyContactGroupId){
    dispatch( action.assign({searchData: {}}) );
    return
  }
  const data = {
    companyContactGroupId:searchData.companyContactGroupId,
  };
  dispatch( action.assign({searchData: data}) );
};

//管理文件
const fileAction = () =>  async (dispatch, getState) => {
  const {editConfig,tree,handleTree} = getSelfState(getState());
  if (await showTreeDialog(editConfig,tree,handleTree,'管理分组')) {
    const treeData = helper.getJsonResult(await helper.fetchJson(URL_TREE_LIST));
    //生成树结构
    const newTree = Tree.createWithInsertRoot(treeData,'所有分组', {guid: 'root', districtType:0});
    dispatch(action.assign({tree:newTree,select:'1-0'}));
    selectActionCreator('1-0')
  }
};

const clickActionCreators = {
  del: delAction,
  searchTree: searchTreeAction,
  search: searchClickActionCreator,
  reset: resetActionCreator,
  add:addActionCreator,
  edit:editActionCreator,
  staff:staffActionCreator,
  file: fileAction,
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
  try{
    const {tree} = getSelfState(getState());
    if(key !== '1-0'){
      //父节点的name和id
      const companyContactGroupId = {
        value:tree[key].value,
        title:tree[key].title
      };
      const body = {
        filter:{
          companyContactGroupId:companyContactGroupId.value
        },
        itemFrom:0,
        itemTo:10
      };
      const {result,returnCode,returnMsg} = await helper.fetchJson(URL_LIST,helper.postOption(body));
      if(returnCode !== 0 ){
        helper.showError(returnMsg);
        return
      }
      dispatch(action.assign({maxRecords: result.returnTotalItem,searchData:{companyContactGroupId},tableItems:result.data, select: key,parents:{title:tree[key].title,value:tree[key].value}}));
    }else {
      const body = {
        filter:{

        },
        itemFrom:0,
        itemTo:10
      };
      const {result,returnCode,returnMsg} = await helper.fetchJson(URL_LIST,helper.postOption(body));
      if(returnCode !== 0 ){
        helper.showError(returnMsg);
        return
      }
      dispatch(action.assign({maxRecords: result.returnTotalItem,searchData:{},tableItems:result.data, select: key,parents:null}));
    }

  }catch (e){
    helper.showError(e.message);
    dispatch(action.assign({tableItems:[], select: key}));
  }


};

const changeActionCreator = (key, value) => (dispatch) =>{
  dispatch(action.assign({[key]: value}, 'searchData'));
};

const pageNumberActionCreator = (currentPage) => (dispatch, getState) => {
  const {pageSize, searchDataBak={}} = getSelfState(getState());
  const newState = {currentPage};
  return search2(dispatch, action, URL_LIST, currentPage, pageSize, toFormValue(searchDataBak), newState);
};

const pageSizeActionCreator = (pageSize, currentPage) => async (dispatch, getState) => {
  const {searchDataBak={}} = getSelfState(getState());
  const newState = {pageSize, currentPage};
  return search2(dispatch, action, URL_LIST, currentPage, pageSize, toFormValue(searchDataBak), newState);
};


const onSearchActionCreator = (key, title) => async (dispatch, getState) => {
  const {filters} = getSelfState(getState());
  let data, options, body;
  switch (key) {
    case 'companyContactGroupId': {

      data = await helper.fetchJson(URL_DROP);
      if (data.returnCode != 0) {
        return;
      }
      break;
    }
    default:
      return;
  }
  options = data.result ;
  const index = filters.findIndex(item => item.key == key);
  dispatch(action.update({options}, 'filters', index));
};


const actionCreators = {
  onInit: initActionCreator,
  onInputChange: inputChangeActionCreator,
  onClick: clickActionCreator,
  onCheck: checkActionCreator,
  onExpand: expandActionCreator,
  onSelect: selectActionCreator,
  onPageNumberChange: pageNumberActionCreator,
  onChange: changeActionCreator,
  onSearch:onSearchActionCreator,
  onPageSizeChange: pageSizeActionCreator,
};


const mapStateToProps = (state) => {
  return getSelfState(state);
};

const Container = connect(mapStateToProps, actionCreators)(EnhanceLoading(TreePage));
export default Container;
