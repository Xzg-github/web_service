import {connect} from 'react-redux';
import UploadDialog from '../../personal_account_management/ShowDiaLog/UploadDialog';
import {Action} from '../../../../../action-reducer/action';
import showPopup from '../../../../../standard-business/showPopup';
import helper from '../../../../../common/common';
import execWithLoading from '../../../../../standard-business/execWithLoading';

const action = new Action(['temp'], false);

const URL_ADD = '/api/signature/account_management/personal_account_management/addSign';//新增

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
    srcImg:null,
    confirmLoading:false
  };
};

const okActionCreator = () => async (dispatch, getState) => {
  const {fileList=[],value,controls} = getSelfState(getState());
  //企业的：生成一个圆形的企业章，尺寸要求：200*166

  let img_url = window.URL.createObjectURL(fileList[0]);
  let img = new Image();
  img.src = img_url;
  img.onload = (e) =>{
    // 打印
    let imgWidth = img.width;
    let imgHeight = img.height;
    if(imgWidth > 200 || imgHeight > 166){
      helper.showError('企业章尺寸不符合要求,建议166*166像素');
      return
    }



    if (!helper.validValue(controls, value)) {
      dispatch(action.assign({valid: true}));
      return;
    }
    if(fileList.length === 0){
      helper.showError('请上传文件');
      return
    }
    dispatch(action.assign({confirmLoading:true}));
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append('file', file);
    });

    execWithLoading(async () => {
      fetch(`/api/proxy/fadada-service/sign_seal/upload_sign_seal`,{
        method: 'post',
        body: formData,
      }).then(function (res) {
        return res.json()
      }).then(async function (json) {
        if(json.returnCode !==0){
          dispatch(action.assign({confirmLoading:false}));
          helper.showError(json.returnMsg);
          return
        }
        const body = {
          id:json.result,
          signSealName:value.signSealName
        };
        const {result,returnCode,returnMsg} = await helper.fetchJson(URL_ADD,helper.postOption(body))
        if(returnCode !=0){
          dispatch(action.assign({confirmLoading:false}));
          helper.showError(returnMsg);
          return
        }
        dispatch(action.assign({confirmLoading:false}))
        helper.showSuccessMsg('新增成功')
        dispatch(action.assign({visible: false, ok: true}));
      })
    });

  }


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
  if(file.size / 1024 / 1024  >  2){
    helper.showError('图片大小需<2MB');
    return
  }else if(file.type !== 'image/png'){
    helper.showError('请上传png图片');
    return
  }
  let srcImg;
  const reader=new FileReader();//读取本地文件,预览图片
  reader.readAsDataURL(file);
  reader.onload =  (result) => {
    srcImg = result.target.result;
    file.thumbUrl = srcImg;
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

const formChangeActionCreator = (key, value) => {
  return action.assign({[key]: value}, 'value');
};

const actionCreators = {
  onChange: changeActionCreator,
  onFormChange:formChangeActionCreator,
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

