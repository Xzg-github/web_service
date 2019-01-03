
const steps = [
  {key: 1, title: '填写账号'},
  {key: 2, title: '验证身份'},
  {key: 3, title: '设置新密码'}
];

const stepButtons = [
  [{key: 'firstNext', title: '下一步', index: 0}],
  [{key: 'secondNext', title: '下一步', index: 1}],
  [{key: 'onOk', title: '确定', index: 2}],
];

const tabs = [
  {key: 'mobile', title: '手机找回'},
  {key: 'email', title: '邮箱找回'}
];

const inputConfig = {
  mobile: [
    [{
      key: 'mobile',
      title: '手机号码',
      type: 'number',
      placeholder: '请输入手机号'
    },{
      key: 'varifyCode_mobile',
      title: '图形验证码',
      type: 'text',
      placeholder: '不区分大小写，点击图片可刷新',
      shortInput: true
    }],
    [{
      key: 'mobile_code',
      title: '短信验证码',
      type: 'text',
      placeholder: '请输入短信验证码',
      shortInput: true
    }],
    [{
      key: 'newPwd_mobile',
      title: '新密码',
      type: 'password',
      placeholder: '请输入新密码，6-16位字母/数字/符号组合'
    },{
      key: 'newPwdAgin_mobile',
      title: '确认新密码',
      type: 'password',
      placeholder: '请输入和上面相同的密码',
      validateMsg: '两次输入的密码不同！'
    }]
  ],
  email: [
    [{
      key: 'email',
      title: '邮箱',
      type: 'email',
      placeholder: '请输入邮箱'
    },{
      key: 'varifyCode_email',
      title: '图形验证码',
      type: 'text',
      placeholder: '不区分大小写，点击图片可刷新',
      shortInput: true
    }],
    [{
      key: 'email_code',
      title: '邮箱验证码',
      type: 'text',
      placeholder: '请输入邮箱中收到的6位数字验证码',
      shortInput: true
    }],
    [{
      key: 'newPwd_email',
      title: '新密码',
      type: 'password',
      placeholder: '请输入新密码，6-16位字母/数字/符号组合'
    },{
      key: 'newPwdAgin_email',
      title: '确认新密码',
      type: 'password',
      placeholder: '请输入和上面相同的密码'
    }]
  ]
};

const validateRules = {
  mobile: {rule: '\d*', msg: '手机号码格式不正确！'},
  email: {rule: '\w*@\w*\.\w*', msg: '邮箱格式不正确！'},
  _code: {rule: '\d(6)', msg: '请输入6位数字验证码！'},
  newPwd_: {rule: '(\w*){6,16}', msg: '请输入6-16位字母/数字/符号组合！'},
  newPwdAgin_: {rule: '', msg: '请输入和上面相同的密码！'}
};

const config = {
  activeKey: 'mobile',
  current: 0,
  mobileType: '+86',
  steps,
  stepButtons,
  tabs,
  inputConfig,
  validateRules
};

export default config;
