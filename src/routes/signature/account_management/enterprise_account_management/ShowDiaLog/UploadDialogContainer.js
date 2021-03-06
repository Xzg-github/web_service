import {connect} from 'react-redux';
import UploadDialog from '../../personal_account_management/ShowDiaLog/UploadDialog';
import {Action} from '../../../../../action-reducer/action';
import showPopup from '../../../../../standard-business/showPopup';
import helper from '../../../../../common/common';
import execWithLoading from '../../../../../standard-business/execWithLoading';

const action = new Action(['temp'], false);

const URL_ADD = '/api/signature/account_management/personal_account_management/addSign';//新增
const URL_DEL = '/api/signature/account_management/personal_account_management/delSign';//删除

const getSelfState = (state) => {
  return state.temp || {};
};


const titleMsg = [
  '上传图片须知：',
  '  仅支持.png格式，图片尺寸小于200*166像素，建议166*166像素，必须上传背景透明的图',
  ' ',
  '背景透明签名制作过程参考：'
];

const msg = [
  '1、在一张白纸上盖章/签章',
  '2、手机拍下刚刚的盖章/签章',
  '3、传到电脑使用PS，对图章/签章抠图（去掉白色背景）',
  '4、生成背景透明的PNG格式图片',
];



const buildState = async(config, items,edit,fileList=[]) => {
  return {
    title: !edit ? '新增' : '编辑',
    controls:config.controls,
    value: items,
    valid: false,
    fileList,
    delFileList: [],
    editFileList:[],
    visible: true,
    edit,
    titleMsg,
    msg,
    previewVisible: false,
    previewImage: '',
    srcImg:null,
    confirmLoading:false
  };
};
/*
* 编辑如果改变图片，需要删除旧图片
* 如果没有改变图片，直接掉用修改接口
* */
const okActionCreator = () => async (dispatch, getState) => {
  const {fileList=[],value,controls,edit} = getSelfState(getState());
  //企业的：生成一个圆形的企业章，尺寸要求：200*166
  if (!helper.validValue(controls, value)) {
    dispatch(action.assign({valid: true}));
    return;
  }

  if(fileList.length === 0){
    helper.showError('请上传文件');
    return
  }
  //如果是编辑操作没有改变图片;
  if(fileList[0].id && edit){
    dispatch(action.assign({confirmLoading:true}));
    const body = {
      id:fileList[0].id,
      signSealName:value.signSealName
    };
    const {result,returnCode,returnMsg} = await helper.fetchJson(URL_ADD,helper.postOption(body));
    if(returnCode !== 0){
      dispatch(action.assign({confirmLoading:false}));
      return helper.showError(returnMsg);
    }
    dispatch(action.assign({confirmLoading:false}));
    dispatch(action.assign({visible: false, ok: true}));
    return helper.showSuccessMsg('操作成功');
  }
  //新增操作或者编辑操作改变了原始图片
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

    dispatch(action.assign({confirmLoading:true}));
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append('file', file);
    });
    execWithLoading(async () => {
      fetch(`/api/proxy/fadada-service/sign_seal/upload_sign_seal/${value.signSealName}`,{
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
        //如果为编辑删除旧签章
        if(edit && value.delId){
          const url = `${URL_DEL}/${value.delId}`;
          const {result,returnCode,returnMsg} = await helper.fetchJson(url,'delete');
          if(returnCode!=0){
            helper.showError('旧签章删除失败');
          }
        }
        dispatch(action.assign({confirmLoading:false}));
        helper.showSuccessMsg('操作成功');
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
  if(typeof value !== 'object'){
    value = value.replace(/^\s+|\s+$/g,"")
  }
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

export default async (config, items={},edit=false,fileList) => {
  const Container = connect(mapStateToProps, actionCreators)(UploadDialog);
  global.store.dispatch(action.create(await buildState(config, items,edit,fileList)));
  await showPopup(Container, {}, true);

  const state = getSelfState(global.store.getState());
  global.store.dispatch(action.create({}));
  return state.ok;
};

