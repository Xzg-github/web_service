import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Page.less';
import { Steps, Select, Input, Button } from 'antd';
import Frame from '../frame/Frame';
import { Card, SuperTab2 } from '../../../components'
const Step = Steps.Step;
const Option = Select.Option;

class Page extends React.Component {
  componentDidMount () {
    this.props.didMountCallback();
  }
  componentDidUpdate () {
    this.props.changeVerifyFlag && this.props.didMountCallback();
  }

  toTabs = () => {
    const {current=0, activeKey, tabs, onTabChange, value, onChangeAccount} = this.props;
    const isMobile = activeKey === 'mobile';
    switch (current) {
      case 0 :
        const props = {activeKey, tabs, onTabChange};
        return <SuperTab2 {...props}/>
      case 1 :
        return (
          <div className={s.bindingBox}>
            <div className={s.bindingInfo}>
              <span>验证当前账号绑定的{isMobile ? '手机号码' : '邮箱'}：&nbsp;</span>
              <span className={s.color}>{isMobile ? value.mobile : value.email}</span>
            </div>
            <a className={s.bindingLink} onClick={onChangeAccount}>更换账号</a>
          </div>
        )
      case 2 : return null;
    }
  }

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
        <li className={s.contentItem}>
          <div className={s.itemTitle}>{item.title}</div>
          <Input {...itemProps} />
          {item.key.includes('varifyCode_') && <div className={s.verifyCodeContainer} id={item.key}></div>}
          {item.key.includes('_code') && (<Button className={s.sendBtn} onClick={sendVarifyCode} disabled={timer > 0}>
            {isAgain}发送验证码{timerInfo}
          </Button>)}
        </li>
      </ul>
    )
  };

  byMobile = (inputsArr, current) => {
    const {mobileType='+86'} = this.props;
    switch (current) {
      case 0:
        inputsArr[0].addonBefore = (
          <Select value={mobileType}>
            <Option value='+86'>+86</Option>
          </Select>
        );
        break;
      case 1:
        break;
    }
    return inputsArr.map(item=>this.toInput(item));
  }

  byEmail = (inputsArr, current) => {
    switch (current) {
      case 0:
        break;
      case 1:
        break;
    }
    return inputsArr.map(item=>this.toInput(item));
  }

  toPage = () => {
    const {current=0, activeKey, inputConfig} = this.props;
    const inputsArr = inputConfig[activeKey][current];
    switch (activeKey){
      case 'mobile' :
        return this.byMobile(inputsArr, current);
      case 'email' :
        return this.byEmail(inputsArr, current);
    }
  }

  toButton = ({key, title, bsStyle='primary', hide=false}, onClick, size='default') => {
    return hide ? null : <Button key={key} type={bsStyle} size={size} onClick={onClick}>{title}</Button>
  }

  toFooter = () => {
    const {stepButtons, activeKey, current, value} = this.props;
    return (
      <div role="footer" className={s.footer}>
        {stepButtons[current].map(btn => {
          const onClick = () => {
            this.props.onClick(btn.key, btn.index);
          };
          return this.toButton(btn, onClick, 'large');
        })}
      </div>
    );
  }

  render() {
    const {steps=[], current=1} = this.props;
    return (
      <Frame contentClass={s.root}>
        <Card className={s.container}>
            <Steps current={current}>{steps.map(o=> <Step key={o.key} title={o.title} />)}</Steps>
            <div className={s.customSuperTab}>{this.toTabs()}</div>
            {this.toPage()}
            {this.toFooter()}
        </Card>
      </Frame>
    )
  }
}

export default withStyles(s)(Page);
