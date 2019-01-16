
const tabs = [
  {key: 'email', title: '个人邮箱'},
  {key: 'mobile', title: '个人手机'},
  {key: 'company', title: '企业邮箱'}
];

const inputConfig = {
  email: [
    {key: 'email', title: '邮箱', type: 'email', placeholder: '请输入邮箱', require: true},
    {key: 'password', title: '密码', type: 'text', placeholder: '请输入8-16位密码，由数字和字母组合(区分大小写)',require: true},
    {key: 'email_code',title: '邮件验证码',type: 'text', shortInput: true, require: true},
    {key: 'varifyCode_email', title: '获取验证码', type: 'text', shortInput: true},
    {key: 'companyNumber',title: '所属企业编号', type: 'text'},
    {key: 'companyName', title: '企业名称', type: 'text'},
  ],
  mobile: [
    {key: 'mobile', title: '手机号码', type: 'number', placeholder: '请输入手机号', require: true},
    {key: 'password', title: '密码', type: 'text', placeholder: '请输入8-16位密码，由数字和字母组合(区分大小写)',require: true},
    {key: 'mobile_code', title: '短信验证码', type: 'text', shortInput: true, require: true},
    {key: 'varifyCode_mobile', title: '获取验证码', type: 'text', shortInput: true},
    {key: 'companyNumber',title: '所属企业编号', type: 'text'},
    {key: 'companyName', title: '企业名称', type: 'text'},
  ],
  company: [
    {key: 'email', title: '邮箱', type: 'email', placeholder: '请输入邮箱', require: true},
    {key: 'password', title: '密码', type: 'text', placeholder: '请输入8-16位密码，由数字和字母组合(区分大小写)',require: true},
    {key: 'email_code',title: '邮件验证码',type: 'text', shortInput: true, require: true},
    {key: 'varifyCode_email', title: '获取验证码', type: 'text', shortInput: true, require: true},
    {key: 'companyName', title: '企业名称', type: 'text', require: true},
    {key: 'contact',title: '联系人',type: 'text', require: true},
    {key: 'contactNumber', title: '联系电话', type: 'text', require: true}
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
  tabs,
  inputConfig,
  validateRules,
  buttons: [{key: 'submit', title: '提交'}]
};

export default config;
