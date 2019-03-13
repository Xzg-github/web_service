import { connect } from 'react-redux';
import OrderTabPage from './OrderTabPage';
import helper, {showError} from '../../common/common';
import {search} from '../../common/search';
import {showColsSetting} from '../../common/tableColsSetting';
import {fetchAllDictionary, setDictionary2, getStatus} from "../../common/dictionary";
import {exportExcelFunc, commonExport} from '../../common/exportExcelSetting';

//实现搜索公共业务
const mySearch = async (dispatch, action, selfState, currentPage, pageSize, filter, newState={}) => {
  const {subActiveKey, urlList, isTotal, subTabs, fixedFilters={}} = selfState;
  const from = (currentPage - 1) * pageSize;
  const to = from + pageSize;
  const {returnCode, returnMsg, result} = await search(urlList, from, to, {...filter, ...fixedFilters[subActiveKey]}, false);
  if (returnCode === 0) {
    if (!result.tags && result.tabTotal) { //转成统一结构
      result.tags = Object.keys(result.tabTotal).map(item => ({tag: item, count: result.tabTotal[item]}));
    }
    const payload = {
      ...newState,
      currentPage: {...selfState.currentPage, [subActiveKey]: currentPage},
      pageSize: {...selfState.pageSize, [subActiveKey]: pageSize},
      tableItems: {...selfState.tableItems, [subActiveKey]: result.data},
      maxRecords: isTotal && result.tags ? subTabs.reduce((obj, tab) => {
        const {count = 0} = result.tags.filter(item => item.tag === tab.status).pop() || {};
        obj[tab.key] = count;
        return obj;
      }, {}) : {[subActiveKey]: result.returnTotalItem || result.returnTotalItems},
      sortInfo: {},
      filterInfo:{}
    };
    dispatch(action.assign(payload));
  } else {
    showError(returnMsg);
  }
};

/**
 * 功能：生成一个公共的列表页面容器组件
 * 参数：action - [必需] 由此容器组件所在位置对应的reducer路径生成
 *       getSelfState - [必需] 获取容器组件在state对应路径下的自身节点状态
 *       actionCreatorsEx - [可选] 页面需覆写和扩展的响应处理
 * 返回：带公共业务处理的列表页面容器组件
 */
const createOrderTabPageContainer = (action, getSelfState, actionCreatorsEx={}) => {

  const searchOptionsActionCreator = (key, filter, config) => async (dispatch) => {
    const {returnCode, result} = await helper.fuzzySearchEx(filter, config);
    dispatch(action.update({options: returnCode === 0 ? result : undefined}, 'filters', {key: 'key', value: key}));
  };

  const changeActionCreator = (key, value) => {
    return action.assign({[key]: value}, 'searchData');
  };

  //点击搜索按钮
  const searchActionCreator = () => async (dispatch, getState) => {
    const selfState = getSelfState(getState());
    const {subActiveKey, pageSize, searchData, subTabs} = selfState;
    const isRefresh = subTabs.reduce((obj, tab) => { //点击搜索按钮将其他页签都置为切换时需要刷新列表状态
      obj[tab.key] = tab.key !== subActiveKey;
      return obj;
    }, {});
    const newState = {searchDataBak: searchData, isRefresh};
    return mySearch(dispatch, action, selfState, 1, pageSize[subActiveKey], searchData, newState);
  };

  const resetActionCreator = () => (dispatch) => {
    dispatch(action.assign({searchData: {}}));
  };

  const checkActionCreator = (subActiveKey, isAll, checked, rowIndex) => {
    isAll && (rowIndex = -1);
    return action.update({checked}, ['tableItems', subActiveKey], rowIndex);
  };

  const pageNumberActionCreator = (currentPage) => (dispatch, getState) => {
    const selfState = getSelfState(getState());
    const {subActiveKey, pageSize, searchDataBak={}} = selfState;
    return mySearch(dispatch, action, selfState, currentPage, pageSize[subActiveKey], searchDataBak, {});
  };

  const pageSizeActionCreator = (pageSize, currentPage) => async (dispatch, getState) => {
    const selfState = getSelfState(getState());
    const {searchDataBak={}} = selfState;
    return mySearch(dispatch, action, selfState, currentPage, pageSize, searchDataBak, {});
  };

  //配置字段按钮
  const configActionCreator = () => (dispatch, getState) => {
    const {tableCols} = getSelfState(getState());
    const okFunc = (newCols) => {
      dispatch(action.assign({tableCols: newCols}));
    };
    showColsSetting(tableCols, okFunc, helper.getRouteKey());
  };

  //前端表格排序和过滤
  const tableChangeActionCreator = (subActiveKey, sortInfo, filterInfo) => (dispatch, getState) => {
    const selfState = getSelfState(getState());
    dispatch(action.assign({
      sortInfo: {...selfState.sortInfo, [subActiveKey]: sortInfo},
      filterInfo: {...selfState.filterInfo, [subActiveKey]: filterInfo}
    }));
  };

  //列表页签切换
  const tabChangeActionCreator = (key) => async (dispatch, getState) => {
    dispatch(action.assign({subActiveKey: key}));
    const selfState = getSelfState(getState());
    const {isRefresh, searchDataBak={}, pageSize, subTabs, subActiveKey, fixedFilters = {}} = selfState;
      fixedFilters.signState = subActiveKey;
    if(subActiveKey === 'all'){
      delete fixedFilters.signState
    }
      const newState = {isRefresh: {...selfState.isRefresh, [key]: false}};
      return mySearch(dispatch, action, selfState, 1, pageSize[key], fixedFilters, newState);
  };

  const mapStateToProps = (state) => {
    return getSelfState(state);
  };

  const actionCreators = {
    //可覆写的响应
    onClickReset: resetActionCreator,     //点击重置按钮
    onClickSearch: searchActionCreator,   //点击搜索按钮
    onConfig: configActionCreator,        //点击配置字段按钮
    onChange: changeActionCreator,        //过滤条件输入改变
    onSearch: searchOptionsActionCreator, //过滤条件为search控件时的下拉搜索响应
    onCheck: checkActionCreator,          //表格勾选响应
    onTableChange: tableChangeActionCreator,  //表格组件过滤条件或排序条件改变响应
    onPageNumberChange: pageNumberActionCreator,  //页数改变响应
    onPageSizeChange: pageSizeActionCreator,      //每页记录条数改变响应
    onSubTabChange: tabChangeActionCreator,          //列表页签切换响应
    //可扩展的响应
    // onClick: 按钮点击响应 func(tabKey, buttonKey)
    // onDoubleClick: 表格双击响应 func(tabKey, rowIndex)
    // onLink: 表格点击链接响应 func(tabKey, key, rowIndex, item)
    ...actionCreatorsEx
  };

  return connect(mapStateToProps, actionCreators)(OrderTabPage);
};

/*
* 功能：构造带页签列表页面的公共初始化状态
 * 参数：urlConfig - [必需] 获取界面配置的url
 *       urlList - [必需] 获取列表数据的url
 *       statusNames - [可选] 需要获取的来自状态字典的表单状态下拉的表单类型值数组
* 返回：成功返回初始化状态，失败返回空
* 根据token判断是否是个人还是企业
* 判断是否是企业登录还是个人登录，看后端给的状态是否是以认证来决定是否需要展示认证
* 帐号状态 0：禁用，1：待认证，2：认证失败 3:已认证
* econtract_admin_role      电子签署平台运营
  econtract_company_role    电子签署企业账号
  econtract_personal_role   电子签署个人账号
* */

const URL_TABSLIST = '/api/signature/signature_center/tabslist';
const ROLE_URL = '/api/permission/role';//根据token判断是否是个人还是企业
const URL_AUTHENTICATION = '/api/signature/account_management/enterprise_account_management/oneList';//企业校验认证
const URL_PERSON = '/api/signature/account_management/personal_account_management/person';//个人
const buildOrderTabPageCommonState = async (urlConfig, urlList, statusNames=[]) => {
  try {
    //获取并完善config
    const config = helper.getJsonResult(await helper.fetchJson(urlConfig));
/*    const dic = helper.getJsonResult(await fetchAllDictionary());
    for (let item of statusNames) {
      dic[item] = helper.getJsonResult(await getStatus(item));
    }
    setDictionary2(dic, config.filters, config.tableCols);*/
    //获取列表数据
    const {subActiveKey, subTabs, isTotal, initPageSize, fixedFilters={}, searchDataBak={}, buttons} = config;
    for(let tab of subTabs){
      if(tab.key === subActiveKey){
        fixedFilters.signState = tab.status;
      }
    }
    const body = {
      itemFrom: 0,
      itemTo: initPageSize,
      ...fixedFilters,
      ...searchDataBak
    };
    const json = helper.getJsonResult(await helper.fetchJson(URL_TABSLIST,'post'));
    const data = helper.getJsonResult(await helper.fetchJson(urlList, helper.postOption(body)));
    if (!data.tags && data.tabTotal) { //转成统一结构
      data.tags = Object.keys(data.tabTotal).map(item => ({tag: item, count: data.tabTotal[item]}));
    }

    //初始化maxRecords
    const maxRecords = isTotal && data.tags ? subTabs.reduce((obj, tab) => {
      const {count = 0} = data.tags.filter(item => item.tag === tab.status).pop() || {};
      obj[tab.key] = count;
      return obj;
    }, {}) : {[subActiveKey]: data.returnTotalItem || data.returnTotalItems};

    //初始化tableItmes\pageSize\currentPage\isRefresh\buttons
    let tableItems = {}, pageSize={}, currentPage={}, isRefresh={};
    subTabs.map(tab => {
      tableItems[tab.key] = [];
      pageSize[tab.key] = initPageSize;
      currentPage[tab.key] = 1;
      isRefresh[tab.key] = true;
    });
    tableItems[subActiveKey] = data.data || [];
    isRefresh[subActiveKey] = false;
    //判断是个人还是企业
    const role = helper.getJsonResult(await helper.fetchJson(`${ROLE_URL}`));
    const url = role === 'econtract_personal_role' ? URL_PERSON: URL_AUTHENTICATION;
    //判断认证
    const res = helper.getJsonResult(await helper.fetchJson(url));
    const state = role === 'econtract_personal_role' ? res.userAccountState: res.companyAccountState
    let isAuthentication = false;
    if(res && state){
      isAuthentication = res.state == 3 ? true: false;
    }
    return {
      searchData:{},
      searchDataBak: {},
      ...config,
      urlList,
      pageSize,
      currentPage,
      maxRecords,
      isRefresh,
      tableItems,
      buttons,
      tabsNumber:json,
      tableCols: helper.initTableCols(helper.getRouteKey(), config.tableCols),
      sortInfo: {},
      filterInfo: {},
      status: 'page',
      isAuthentication,
      role
    };
  } catch (e) {
    helper.showError(e.message);
  }
};

/*
* 功能：实现公共业务-按钮操作后刷新列表
 * 参数：refreshArr - [可选] 操作后需要刷新的页签KEY数组，结构如： ['tabKey', 'tabKey2']
* */
const updateTable = (dispatch, action, selfState, refreshArr=[]) => {
  const {subActiveKey, currentPage, pageSize, searchDataBak} = selfState;
  const isRefresh = {...selfState.isRefresh};
  refreshArr.map(item => {isRefresh[item] = true});
  const newState = {isRefresh};
  return mySearch(dispatch, action, selfState, currentPage[subActiveKey], pageSize[subActiveKey], searchDataBak, newState);
};

export default createOrderTabPageContainer;
export {buildOrderTabPageCommonState, updateTable};
