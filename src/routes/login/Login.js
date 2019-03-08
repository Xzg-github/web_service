import React, {PropTypes} from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Login.less';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Icon from 'antd/lib/icon';
import Checkbox from 'antd/lib/checkbox';
import Button from 'antd/lib/button';
import helper from '../../common/common';

const URL_LOGIN = '/api/login';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {loading: false, email: '',phoneNumber: '', accountPassword: '', disabled: true};
    this.onLogin = this.onLogin.bind(this);
  }
  componentDidMount() {
    this.setState({disabled: false});
  }

  async onLogin(e) {
    e.preventDefault();
    const {email, accountPassword} = this.state;
    if (!email || !accountPassword) {
      helper.showError('请输入用户名或密码');
      return;
    }
    let params = {};
    if(this.isEmail(email)){
      params = {accountPassword, email};
    }else if(this.isMobile(email)){
      params = {accountPassword, phoneNumber:email}
  }else{
      helper.showError('手机账号或邮箱格式不正确');
      return
    }
    this.setState({loading: {delay: 200}});
    const {returnCode, returnMsg} = await helper.fetchJson(URL_LOGIN, helper.postOption(params));
    if (returnCode !== 0) {
      helper.showError(returnMsg);
    } else {
      window.location.href = '/';
    }
    this.setState({loading: false});
  };

  onChange = (e) => {
    const {name, value} = e.target;
    this.setState({[name]: value});
  };

  toIcon = (type) => {
    return <Icon type={type} style={{fontSize: 14}} />;
  };

  isEmail = (str) => {
    const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+$/;
    return reg.test(str);
  };

  isMobile = (str) => {
    const reg = /^[1][34578][0-9]{9}$/;
    return reg.test(str);
  };

  toInput = (key, type, extra={}) => {
    const props = {
      ...extra,
      type,
      prefix: this.toIcon(type),
      size: 'large',
      value: this.state[key],
      onChange: this.onChange,
      name: key
    };
    return <Input {...props} />;
  };

  toOkButton = () => {
    const props = {
      type: 'primary',
      style: {width: '100%',fontSize:'16px'},
      htmlType: 'submit',
      loading: this.state.loading,
      disabled: this.state.disabled};
    return (
      <div style={{marginTop: '32px'}}>
        <Button {...props}>登录</Button>
      </div>
    );
  };

  render() {
    return (
      <div className={s.root}>
        <div className={s.bigBox}>
          <img src='/bubble_one.png' className={s.bubble_one} />
          <img src='/bubble_two.png' className={s.bubble_two} />
          <img src='/bubble_three.png' className={s.bubble_three} />
            <div className={s.login}>
              <div className={s.l_side}>
                <img src="/logo.jpg" className={s.logo}/>
                <img src="/customerService.jpg" className={s.customerService} />
              </div>
              <div className={s.r_side}>
                <h1 role='title'>电子合同管理系统</h1>
                  <Form onSubmit={this.onLogin}>
                    <Form.Item>
                      {this.toInput('email', 'user', {placeholder: '邮箱/手机号'})}
                    </Form.Item>
                    <Form.Item>
                      {this.toInput('accountPassword', 'password', {type: 'accountPassword', placeholder: '密码'})}
                    </Form.Item>
                    <Form.Item>
                      <Checkbox defaultChecked>记住密码</Checkbox>
                      <a role='registered' href='/registered'>注册账户</a>
                      <a role='forget' href='/password/find'>忘记密码</a>
                      {this.toOkButton()}
                      <div style={{width: '350px',height: '20px', textAlign: 'center'}}>
                      </div>
                    </Form.Item>
                  </Form>
              </div>
              <p>Copyright ©2005 - 2013 深圳市云恋科技有限公司   <a href="http://www.miitbeian.gov.cn" style={{color: '#fff'}} target= "_blank">粤ICP备17104734号-1</a></p>
            </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Login);
