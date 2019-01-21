import React from 'react';
import {SuperTab2, Card, SuperToolbar } from '../../components';
import Frame from '../password/frame/Frame';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {Input, Button } from 'antd';
import s from './Page.less';

class Page extends React.Component {


  toTabs = () =>{
    const {activeKey, tabs, onTabChange, value, onChangeAccount} = this.props;
    const props = {activeKey, tabs, onTabChange};
    return <SuperTab2 {...props}/>
  };

  toInput = (item) => {
    const {value, onChange, sendVarifyCode, timer} = this.props;
    const itemProps = {
      key: item.key,
      title: item.title,
      type: item.type,
      placeholder: item.placeholder,
      className: item.shortInput ? s.shortInput : '',
      value: value[item.key],
      onChange: (e) => {onChange(item.key, e.target.value)}
    };
    const timerInfo = timer > 0 ? <b>&nbsp;(&nbsp;{timer}&nbsp;)</b> : '';
    const isAgain = timer === 0 ? '重新' : '';
    return (
      <ul className={s.content} key={item.key}>
        <li>
          <div>{item.title}</div>
          <Input {...itemProps} />
          {item.key.includes('_code') && (<Button className={s.sendBtn} onClick={sendVarifyCode} disabled={timer > 0}>
            {isAgain}发送验证码{timerInfo}
          </Button>)}
        </li>
      </ul>
    )
  };

  byEmail = () => {
    const {activeKey, inputConfig} = this.props;
    const inputArr = inputConfig[activeKey];
    return inputArr.map(item => this.toInput(item))
  };

  byMobile = () => {
    const {activeKey, inputConfig} = this.props;
    const inputArr = inputConfig[activeKey];
    return inputArr.map(item => this.toInput(item));
  };

  byCompany = () => {
    const {activeKey, inputConfig} = this.props;
    const inputArr = inputConfig[activeKey];
    return inputArr.map(item => this.toInput(item));
  };

  toPage = () => {
    const {activeKey} = this.props;
    switch (activeKey){
      case 'email':
        return this.byEmail();
      case 'phoneNumber':
        return this.byMobile();
      case 'company':
        return this.byCompany()
    }
  };

  toFooter = () => {
    const {buttons, onClick, value} = this.props;
    const props = { buttons, size: 'default', onClick};
    return <SuperToolbar {...props} />;
  };

  render(){
    return (
      <Frame  contentClass={s.root}>
        <Card className={s.container}>
          <div><h1>注册</h1></div>
          <div className={s.customSuperTab}>{this.toTabs()}</div>
          {this.toPage()}
          <div className = {s.footer}>{this.toFooter()}</div>
        </Card>
      </Frame>
    )
  }
}

export default withStyles(s)(Page);
