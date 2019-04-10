import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {ModalWithDrag, SuperForm,Title} from '../../../../../components';
import {Upload, Icon,Button,Alert} from 'antd';
import s from './UploadDialog.less';

const inputAccept = [
  'image/png'
];

const titleMsg = [
  '上传图片须知：',
  '  仅支持.png格式，图片尺寸小于200*160像素，建议166*166像素，必须上传背景透明的图',
  ' ',
  '背景透明签名制作过程参考：'
];

const msg = [
  '1、在一张白纸上盖章/签章',
  '2、手机拍下刚刚的盖章/签章',
  '3、传到电脑使用PS，对图章/签章抠图（去掉白色背景）',
  '4、生成背景透明的PNG格式图片',
];


class UploadDialog extends React.Component {

  onClick = (key) => {
    this.props.onClick(key);
  };

  toUploadIcon = () => {  // 上传按钮
    return (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
  };


  toUpload = () => {
    const { fileList=[], onChange, onRemove, onPreview ,isLook} = this.props;
    const props = {
      name: 'file',
      listType:'picture-card',
      action: '/api/proxy/zuul/archiver_service/file/upload/document',
      fileList,
      onChange,
      onRemove:isLook ? false : onRemove,
      onPreview,
      accept:inputAccept.join(','),
      beforeUpload:() => false,
    };

    return (
      <Upload {...props}>
        {(fileList.length < 1 && !isLook) && this.toUploadIcon()}
      </Upload >
    );
  };

  toLabel = () => {
    return (
      <label><span style={{color:'#f04134'}}>*</span>请上传模板&nbsp;&nbsp;</label>
    );
  };

  toForm = () => {
    const {controls, value, valid, onFormChange, onFormSearch, onExitValid,isLook,onAdd} = this.props;
    const props = {
      readonly:isLook,
      controls,
      value,
      valid,
      onAdd,
      onChange: onFormChange,
      onSearch: onFormSearch,
      onExitValid,
      colNum:2,
    };
    return <SuperForm {...props} />;
  };

  getProps = () => {
    const { title, fileList=[], confirmLoading=false,isLook,visible,afterClose} = this.props;
    const props = {
      className: s.root ,
      title: isLook ? '查看': title  ,
      visible,
      maskClosable: false,
      width: 600,
      onOk: this.onClick.bind(null, 'ok'),
      onCancel: this.onClick.bind(null, 'close'),
      confirmLoading,
      afterClose
    };
    isLook && (props.footer = null);
    return props;
  };




  Alert = () => {
    const messageStr = (str,title) => {
      return (
        <div className={s.alert}>
          {title.map((it, i) => (<p key={i}>{it}<br/></p>))}
          {msg.map((it, i) => (<span key={i}>{it}<br/></span>))}
        </div>
      )

    };
    const props = {
      type:'warning',
      message:messageStr(msg,titleMsg),
      closable:true
    };
    return (
      <Alert {...props}/>
    );
  };

  toPreviewDialog = () => {
    const {previewImage, onClosePreview, previewVisible=falsem,confirmLoading} = this.props;
    const props = {
      title: '预览',
      confirmLoading,
      onCancel: onClosePreview,
      visible: previewVisible,
      maskClosable: true,
      footer: null
    };
    return (
      <ModalWithDrag {...props}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </ModalWithDrag>
    );
  };


  render() {
    return (
      <ModalWithDrag {...this.getProps()}>
        {this.Alert()}
        {this.toForm()}
        {this.toLabel()}
        {this.toUpload()}
        {this.toPreviewDialog()}
      </ModalWithDrag>
    );
  }
}

export default withStyles(s)(UploadDialog);
