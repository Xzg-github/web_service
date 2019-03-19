import React, {PropTypes} from 'react';
import {Upload,  Button} from 'antd';
import s from './UploadDialog.less';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

/*
  * 客户档案上传组件 可以上传图片并在列表中显示缩略图
  * isLook: 上传组件是否显示上传按钮
  * src: 当前组件需要展示的图片的url
  * title: 当前组件的title
 */

//照片格式 只支持jpg jpeg png格式
const FORMATS = 'image/jpeg, image/jpg, image/png';

class UploadDialog extends React.Component{
  static propTypes = {
    isLook: PropTypes.bool,
    src: PropTypes.string,
    title: PropTypes.string,
    key: PropTypes.string,
    onChange: PropTypes.func
  };

  onChange = ({file}) =>  {
    const {onChange,key} = this.props;
    onChange && onChange(key, file);
  };

  toUpload = () => {
    const uploadProps = {
      fileList:[],
      onChange: this.onChange,
      onRemove: false ,
      accept: FORMATS,
      beforeUpload: () => false
    };
    return (
      <Upload {...uploadProps}>
        <Button>上传图片</Button>
      </Upload >
    );
  };

  toLabel = () => {
    return (
      <label style={{display:'block'}}><span style={{color:'#f04134', fontFamily: 'SimSun'}}>*</span>{this.props.title}</label>
    );
  };

  toComment1 = () => {
    return (
      <div>
        <h3>示例图</h3>
        <p>组织机构等非企业单位，请上传登记执照<br/>支持.jpg .jpeg .png格式，大小不超过20M</p>
      </div>
    )
  };

  toComment2 = () => {
    return (
      <div>
        <h3>示例图</h3>
        <p>步骤一: 请下载《企业认证申请表》<br/>步骤二：法大大账号及数字证书申请表盖章扫描件（盖章原件需邮寄）<br/>支持.jpg .jpeg .png格式，大小不超过20M</p>
      </div>
    )
  };

  toComment3 = () => {
    return (
      <div>
        <h3>示例图</h3>
        <p>图片所有信息需清晰可见，内容真实有效<br/>支持.jpg .jpeg .png格式，大小不超过20M</p>
      </div>
    )
  };

  toRightComment = (key) => {debugger
    if (key === 'BLRN' || key === 'OCC') {
      return this.toComment1();
    } else if (key === 'apply'){
      return this.toComment2();
    }
    else if (key === 'corporateRes' || key === 'accountManager') {
      return this.toComment3();
    }
  };

  render() {
    const {src, isLook, UploadKey} = this.props;
    const url = 'http://img.mp.itc.cn/upload/20160906/9ef83821c2ae4d31b4341553f9d88a7f_th.jpg';
    return (
      <div className={s.root}>
        {this.toLabel()}
        <div className={s.imgDiv}>
          <img src={src ? src : url}/>
        </div>
        <div className={s.rightDiv}>
          {isLook && this.toRightComment(UploadKey)}
          {!isLook && this.toUpload()}
        </div>
      </div>
    )
  }
};

export default withStyles(s)(UploadDialog);
