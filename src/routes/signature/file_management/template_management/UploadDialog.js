import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {ModalWithDrag, SuperForm,Title} from '../../../../components';
import {Upload, Icon,Button,Alert} from 'antd';
import helper from '../../../../common/common';
import s from './UploadDialog.less';

const inputAccept = [
  'application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-works','application/pdf','application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet\n'
];

class UploadDialog extends React.Component {

  onClick = (key) => {
    this.props.onClick(key);
  };

  toUpload = () => {
    const { fileList=[], onChange, onRemove, onPreview ,isLook} = this.props;
    const props = {
      name: 'file',
      action: '/api/proxy/zuul/archiver_service/file/upload/document',
      fileList,
      onChange,
      onRemove:isLook ? false : onRemove,
      onPreview,
      accept:inputAccept.join(','),
      beforeUpload:() => false,
    };

    return (
      <div className={fileList.length < 1 ? s.upload : ''}>
        <Upload {...props}>
          <Button>
            <Icon type="upload" /> 选择文件
          </Button>
        </Upload >
      </div>
    );
  };

  toLabel = () => {
    return (
      <label><span style={{color:'#f04134'}}>*</span>请上传模板</label>
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
      className: fileList.length < 10 ? s.root : s.root2,
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

  render() {
    return (
      <ModalWithDrag {...this.getProps()}>
        {this.Alert()}
        {this.toLabel()}
        {this.toUpload()}
        {this.toForm()}
      </ModalWithDrag>
    );
  }
}

export default withStyles(s)(UploadDialog);
