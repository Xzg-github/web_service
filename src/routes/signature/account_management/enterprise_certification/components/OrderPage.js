import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import {Alert} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './OrderPage.less';
import {Card,SuperToolbar} from '../../../../../components/index';
import SuperForm from './SuperForm';
import Upload from './UploadDialog';




class OrderPage extends React.Component {

  constructor(props) {
    super(props);
  }

  toAlert = () => {
    const messageStr = () => {
      return (
        <p>
          您的账号还未完成实名认证，请先认证，以获取专属CA证书、订购套餐、签发文件资格等服务
          <span className={s.hearder_box}>未发起认证</span>
        </p>
      )

    };
    const props = {
      type:'info',
      message:messageStr(),
      closable:true,
      showIcon:true,
      afterClose:() => {
        console.log(2);
      }
    };
    return (
      <Alert {...props}/>
    );
  };

  toForm = (props,controls) => {
    const {value, valid, onChange, onSearch, onExitValid,onClick,isLook} = props;

    const propsObj = {
      readonly:isLook,
      controls,
      value,
      valid,
      onChange,
      onSearch,
      onExitValid,
      colNum:1,
      onClick
    };
    return <SuperForm {...propsObj} />;
  };


  toUpload = (props,keyUpload,title) => {
    const { onUploadChange , fileList=[],srcObj,isLook} = props;
    const propsObj = {
      keyUpload,
      title,
      fileList,
      srcObj,
      isLook,
      key:keyUpload,
      onChange:onUploadChange,
    };
    return <Upload {...propsObj} />;
  };

  tuButton = (props) => {
    const {buttons, onClick} = props;
    const propsObj = {
      size: 'default',
      buttons,
      onClick
    };
    return <SuperToolbar {...propsObj}/>;
  };


  render() {
    const props = this.props;

    return (
      <div className={s.root}>
        <Card>
          {props.tabKey === 'one' && !props.isLook? this.toAlert() : null}
          <div role="form">
            <div className={s.form}>
              {this.toForm(props,props.controlsLeft)}
            </div>
            <div className={s.form}>
              {this.toForm(props,props.controlsRight)}
            </div>
          </div>
          {props.uploadBox.map((upload) => this.toUpload(props,upload.key,upload.title))}
          {this.tuButton(props)}
        </Card>
      </div>
    );
  };
}

export default withStyles(s)(OrderPage);
