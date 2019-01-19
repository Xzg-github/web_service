
const tabs = [
  {key: 'email', title: '个人邮箱'},
  {key: 'phoneNumber', title: '个人手机'},
  {key: 'company', title: '企业邮箱'}
];

const inputConfig = {
  email: [
    {key: 'email', title: '邮箱*', type: 'email', placeholder: '请输入邮箱'},
    {key: 'accountPassword', title: '密码*', type: 'text', placeholder: '请输入8-16位密码，由数字和字母组合(区分大小写)'},
    {key: 'verifyCode',title: '邮件验证码',type: 'text', shortInput: true},
    {key: 'belongCompanyCode',title: '所属企业编号', type: 'text'},
    {key: 'belongCompanyName', title: '企业名称', type: 'text'},
  ],
  phoneNumber: [
    {key: 'phoneNumber', title: '手机号码*', type: 'number', placeholder: '请输入手机号'},
    {key: 'accountPassword', title: '密码*', type: 'text', placeholder: '请输入8-16位密码，由数字和字母组合(区分大小写)'},
    {key: 'verifyCode', title: '短信验证码*', type: 'text', shortInput: true},
    {key: 'belongCompanyCode',title: '所属企业编号', type: 'text'},
    {key: 'belongCompanyName', title: '企业名称', type: 'text'},
  ],
  company: [
    {key: 'company', title: '邮箱*', type: 'email', placeholder: '请输入邮箱'},
    {key: 'accountPassword', title: '密码*', type: 'text', placeholder: '请输入8-16位密码，由数字和字母组合(区分大小写)'},
    {key: 'verifyCode',title: '邮件验证码*',type: 'text', shortInput: true},
    {key: 'belongCompanyName', title: '企业名称*', type: 'text'},
    {key: 'contact',title: '联系人*',type: 'text'},
    {key: 'contactNumber', title: '联系电话*', type: 'text'}
  ]
};

const validateRules = {
  phoneNumber: {rule: '\d*', msg: '手机号码格式不正确！'},
  email: {rule: '\w*@\w*\.\w*', msg: '邮箱格式不正确！'},
  company:{rule: '\w*@\w*\.\w*', msg: '邮箱格式不正确！'},
  _code: {rule: '\d(6)', msg: '请输入6位数字验证码！'},
};

const config = {
  activeKey: 'email',
  current: 0,
  mobileType: '+86',
  tabs,
  inputConfig,
  validateRules,
  buttons: [{key: 'submit', title: '提交', bsStyle: 'primary'}]
};

export default config;
