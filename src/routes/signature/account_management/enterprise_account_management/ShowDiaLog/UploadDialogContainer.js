import {connect} from 'react-redux';
import UploadDialog from './UploadDialog';
import {Action} from '../../../../../action-reducer/action';
import showPopup from '../../../../../standard-business/showPopup';
import helper from '../../../../../common/common';

const action = new Action(['temp'], false);

const msg = [
  '背景透明签名制作过程参考：',
  '1、在一张白纸上盖章/签章',
  '2、手机拍下刚刚的盖章/签章',
  '3、传到电脑使用PS，对图章/签章抠图（去掉白色背景）',
  '4、生成背景透明的PNG格式图片',
  " ",
  '仅支持.png格式，文件大小<=2MB，长、宽均<200像素，必须上传背景透明的图'
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
    previewVisible: false,
    previewImage: '',
    msg,
    srcImg:null
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
    helper.showError('图片大小需<20MB');
    return
  }
  let srcImg;
  const reader=new FileReader();//读取本地文件,预览图片
  reader.readAsDataURL(file);
  reader.onload =  (result) => {
    srcImg = result.target.result;
    file.thumbUrl = srcImg
    const newList = [file];
    dispatch(action.assign({fileList:newList,srcImg:srcImg}))
  };

};

const removeActionCreator = (file) => async (dispatch,getState) => {
  const {fileList=[]} = getSelfState(getState());
  const index = fileList.indexOf(file);
  const newFileList = fileList.slice();
  newFileList.splice(index, 1);
  dispatch(action.assign({fileList:newFileList}));
};

const previewActionCreator = (file) => {
  return action.assign({
    previewImage: file.url || file.thumbUrl,
    previewVisible: true,
  });
};

const closePreviewActionCreator = () => {
  return action.assign({previewVisible: false});
};


const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onChange: changeActionCreator,
  onRemove: removeActionCreator,
  onClick: clickActionCreator,
  onExitValid: exitValidActionCreator,
  onPreview: previewActionCreator,
  onClosePreview: closePreviewActionCreator,
};

export default async (config, items={},edit=false) => {
  const Container = connect(mapStateToProps, actionCreators)(UploadDialog);
  global.store.dispatch(action.create(await buildState(config, items,edit)));
  await showPopup(Container, {}, true);

  const state = getSelfState(global.store.getState());
  global.store.dispatch(action.create({}));
  return state.ok;
};

