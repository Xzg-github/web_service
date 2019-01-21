import React from 'react';
import ReactDOM from 'react-dom';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {Upload, Icon,Button} from 'antd';
import helper from '../../../../../common/common';
import s from './UploadDialog.less';



class UploadDialog extends React.Component {


  onClick = (key) => {
    this.props.onClick(key);
  };

  onChange = ({file}) =>  {
    const {onChange,keyUpload} = this.props;

    if (onChange) {
      onChange(keyUpload, file);
    }
  };


  toUpload = () => {
    const { fileList=[] } = this.props;
    const props = {
      name: 'file',
      fileList,
      onChange:this.onChange,
      onRemove: false ,
      accept:'image/*',
      beforeUpload:(file) => {
        return false
      }
    };

    return (
      <Upload {...props}>
        <Button>
          上传图片
        </Button>
      </Upload >
    );
  };

  toLabel = () => {
    const { title } = this.props;
    return (
      <label style={{display:'block'}}><span style={{color:'#f04134'}}>*</span>{title}</label>
    );
  };


  render() {
    const { srcObj ,keyUpload ,isLook} = this.props;

    return (
      <div className={s.root}>
        {this.toLabel()}
        <div className={s.imgDiv}>
          <img src={srcObj[keyUpload]  ? srcObj[keyUpload] : require('../../../../../../public/default_picture.png')}/>
        </div>
        <div className={s.rightDiv}>
          <h3>示例图</h3>
          <p>组织机构等非企业单位，请上传登记执照<br/>支持.jpg .jpeg .png格式，大小不超过20M</p>
          {isLook ? null : this.toUpload()}
        </div>
      </div>
    );
  }
}

export default withStyles(s)(UploadDialog);
