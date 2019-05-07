import React from 'react';
import { connect } from 'react-redux';
import {EnhanceLoading} from '../../../components/Enhance';
import {getPathValue} from '../../../action-reducer/helper';
import {Action} from '../../../action-reducer/action';
import helper from '../../../common/common';
import {search} from '../../../common/search';
import {buildOrderPageState} from '../../../common/state';
import OrderPageContainer from './OrderPageContainer';

const STATE_PATH = ['businessOrder'];
const action = new Action(STATE_PATH);

const URL_LIST = '/api/signature/businessOrder/list';
const URL_CONFIG = '/api/signature/businessOrder/config';

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const initActionCreator = () => async (dispatch, getState) => {
  try {
    dispatch(action.assign({status: 'loading'}));
    //初始化数据
    const { index, editDialogConfig, auditDialogConfig} = helper.getJsonResult(await helper.fetchJson(URL_CONFIG));
    //页面数据
    const list = helper.getJsonResult(await search(URL_LIST, 0, index.pageSize, {}));

    const newState = {editDialogConfig, auditDialogConfig, status: 'page'};
    const payload = buildOrderPageState(list, index, newState);

    dispatch(action.create(payload));
  }catch (e){
    helper.showError(e.message);
    dispatch(action.assign({status: 'retry'}));
  }
};

const actionCreators = {
  onInit: initActionCreator
};

const mapStateToProps = (state) => {
  return getSelfState(state)
};

const UIComponent = EnhanceLoading(OrderPageContainer);

export default connect(mapStateToProps, actionCreators)(UIComponent);
