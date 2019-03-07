import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {ModalWithDrag, SuperForm,Title} from '../../../../../components';
import {Upload, Icon,Button,Alert} from 'antd';
import s from './UploadDialog.less';

const inputAccept = [
  'image/png'
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
    const {msg} = this.props;
    const messageStr = (str) => {
      return (<p>{msg.map((it, i) => (<span key={i}>{it}<br/></span>))}</p>)

    };
    const props = {
      type:'warning',
      message:messageStr(msg),
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
