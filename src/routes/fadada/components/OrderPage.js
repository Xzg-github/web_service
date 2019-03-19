import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import {Button,Input,Icon} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './OrderPage.less';
import {SuperForm} from '../../../components/index';
import QRCode from 'qrcode.react'





class OrderPage extends React.Component {

  constructor(props) {
    super(props);
  }



  toInput = (key,  placeholder) => {
    const {value,onFormChange} = this.props;
    const props = {
      placeholder,
      style: { width: '100%', marginBottom: '10px' },
      value: value[key],
      onChange:(e) => onFormChange(e.target.value,key)
    };
    return <Input {...props} />;
  };

  toOkButton = () => {
    const props = {
      style: {width: '100%',fontSize:'16px'},
      loading:this.props.loading,
      href:this.props.href,
    };
    return (
      <div style={{marginTop: '5%'}}>
        <Button {...props} onClick={this.props.next}>下一步</Button>
      </div>
    );
  };



  render() {
    return (
      <div className={s.root}>
        <div className={s.box}>
          <h1 role='title'>ePLD供应链管理系统</h1>
          {this.toInput('mobile', '手机号')}
          {this.toInput('idNumber', '身份证号')}
          {this.toInput('realName', '姓名')}
          {this.toOkButton()}
        </div>
      </div>
    );
  };
}

export default withStyles(s)(OrderPage);
