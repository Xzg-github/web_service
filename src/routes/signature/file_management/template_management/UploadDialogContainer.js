import {connect} from 'react-redux';
import UploadDialog from './UploadDialog';
import {Action} from '../../../../action-reducer/action';
import showPopup from '../../../../standard-business/showPopup';
import helper from '../../../../common/common';

const action = new Action(['temp'], false);

const msg = [
  '1.仅支持 .doc 、.docx、 .wps 、.pdf 、.xls、 .xlsx格式',
  '2.文件大小需<20MB',
  '3.模板在线编辑功能仅支持 .doc 、.docx、 .wps 、.pdf 、.xls、 .xlsx格式的文件',
  '注：上传.xls、.xlsx文档请先用Office预览，确保内容不超过A4纸范围。'
];

const getSelfState = (state) => {
  return state.temp || {};
};

const buildState = async(config, items,edit) => {
  return {
    title: !edit ? '新增' : '编辑',
    controls:config.controls,
    value: items,
    valid: false,
    fileList: [],
    delFileList: [],
    editFileList:[],
    visible: true,
    edit,
    msg
  };
};

const okActionCreator = () => async (dispatch, getState) => {
  const {fileList=[]} = getSelfState(getState());
  const formData = new FormData();
  fileList.forEach((file) => {
    formData.append('file', file);
  });

  fetch('/api/proxy/zuul/archiver_service/file/upload/document',{
    method: 'post',
    body: formData,
  }).then(function (res) {
    return res.json()
  }).then(function (json) {
    console.log(json);
  })
};

const closeActionCreator = () => (dispatch) => {
  dispatch(action.assign({visible: false, ok: false}));
};

const clickActionCreators = {
  ok: okActionCreator,
  close: closeActionCreator
};

const clickActionCreator = (key) => {
  if (clickActionCreators.hasOwnProperty(key)) {
    return clickActionCreators[key]();
  } else {
    return {type: 'unknown'};
  }
};

const exitValidActionCreator = () => {
  return action.assign({valid: false});
};

const changeActionCreator = ({file, fileList}) => (dispatch,getState) => {
  const {fileList=[]} = getSelfState(getState());
  if(file.size / 1024 / 1024  >  20){
    helper.showError('文件大小需<20MB');
    return
  }
  const newList = [file,...fileList];
  dispatch(action.assign({fileList:newList}))
};

const removeActionCreator = (file) => async (dispatch,getState) => {
  const {fileList=[]} = getSelfState(getState());
  const index = fileList.indexOf(file);
  const newFileList = fileList.slice();
  newFileList.splice(index, 1);
  dispatch(action.assign({fileList:newFileList}));
};


const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onChange: changeActionCreator,
  onRemove: removeActionCreator,
  onClick: clickActionCreator,
  onExitValid: exitValidActionCreator,

};

export default async (config, items={},edit=false) => {
  const Container = connect(mapStateToProps, actionCreators)(UploadDialog);
  global.store.dispatch(action.create(await buildState(config, items,edit)));
  await showPopup(Container, {}, true);

  const state = getSelfState(global.store.getState());
  global.store.dispatch(action.create({}));
  return state.ok;
};

