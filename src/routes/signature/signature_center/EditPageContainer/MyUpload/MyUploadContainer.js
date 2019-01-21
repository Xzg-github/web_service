/**
 * @description 上传功能容器组件
 * @author Zheng Hong Sheng
 */
import {connect} from 'react-redux';
import MyUpload from './MyUpload';
import {Action} from '../../../../../action-reducer/action';
import {getPathValue} from '../../../../../action-reducer/helper';
import {postOption, validValue, fetchJson, showError} from '../../../../../common/common';


const STATE_PATH = ['signature_center'];
const URL_DELETEIMAGE = '/api/basic/material/deleteImage';


const action = new Action(STATE_PATH);
//获取当前状态
const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

//增加
const onUploadActionCreator = (imgUrl) => async(dispatch, getState) => {
  const {value} = getSelfState(getState());
  let x=[];
  if(!value.imgUrl){
     x=[imgUrl]
  }else{
   x=JSON.parse(value.imgUrl);
    if(x.length<1){x=[imgUrl]}
    else{x.push(imgUrl)}
  }
  dispatch(action.assign({imgUrl:JSON.stringify(x)}, 'value'));
};

//删除
const onDeleteActionCreator=(imgUrl,title) => async(dispatch, getState) => {
  const {value} = getSelfState(getState());
 const y=JSON.parse(value.imgUrl);
    y.splice(y.indexOf(imgUrl),1);
  if(title !== "编辑"){
    const {returnCode, result} = await fetchJson(URL_DELETEIMAGE, postOption([imgUrl]));
  }
  dispatch(action.assign({imgUrl:JSON.stringify(y)}, 'value'));
};

const actionCreators = {
  onUpload:onUploadActionCreator,
  onDelete:onDeleteActionCreator
};

const mapStateToProps = (state) => {
  return getSelfState(state)
};

const Container = connect(mapStateToProps, actionCreators)(MyUpload);
export default Container;
