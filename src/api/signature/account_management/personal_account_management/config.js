import {pageSize, pageSizeType, description, searchConfig} from '../../../gloablConfig';


const oneControls = [

  {key:'dgyhzh',title:'对公银行账号',type:'text',required:true, btn:{title:"获取验证码",key:'code'}},

  {key:'dgyhmc',title:'对公银行名称',type:'text',required:true},

  {key:'dgyykhzh',title:'对公开户支行',type:'text',required:true,props:{
    placeholder:'请填写完整的支行名称'
  }},
];


const LABELS = [
  //{key: 'qymc', title: '账号头像',type:'avatar'},
  {key: 'grzh', title: '个人账号'},
  //{key: 'accountPassword', title: '登录密码',type:'edit'},
  {key: 'realName', title: '真实姓名'},
  {key: 'idNumber', title: '身份账号'},
  {key: 'notifyPhone', title: '手机号码'},
  {key: 'notifyEmail', title: '电子邮件'},
  {key: 'companyName', title: '归属企业',type:'edit'},
];

const two_buttons = [
  {key:'add',title:'新增',bsStyle:'primary'},
  {key:'del',title:'删除'},
];



const two_controls = [
  {key:'signSealName',title:'签章名称',type:'text',required:true},
];


const three_buttons = [
  {key:'add',title:'新增',bsStyle:'primary'},
  {key:'edit',title:'编辑'},
  {key:'del',title:'删除'},
  {key:'disable',title:'禁用'},
];



const three_tableCols = [
  {key:'a',title:'状态'},
  {key:'b',title:'真实姓名'},
  {key:'c',title:'账号'},
  {key:'d',title:'手机号'},
  {key:'e',title:'电子邮件'},
  {key:'f',title:'授权签章名称'},
  {key:'g',title:'授权开始日期'},
  {key:'h',title:'授权截止日期'},
  {key:'i',title:'操作人'},
  {key:'w',title:'操作时间'},

];

const three_controls = [
  {key:'a',title:'请选择被授权人',type:'select',required:true},
  {key:'b',title:'授权人账号',type:'search'},
  {key:'c',title:'授权人手机号',type:'number'},
  {key:'d',title:'授权人所属部门',type:'search'},
  {key:'e',title:'授权开始日期',type:'date',required:true},
  {key:'f',title:'授权截止日期',type:'date',required:true},
  {key:'g',title:'授权签章',type:'select',required:true},
];


const four_tableCols = [
  {key:'a',title:'订单状态'},
  {key:'b',title:'订单编号'},
  {key:'c',title:'订购金额'},
  {key:'h',title:'有效期'},
  {key:'d',title:'订购时间'},
  {key:'e',title:'支付方式'},
  {key:'f',title:'付款流水号'},
  {key:'g',title:'付款时间'},
  {key:'o',title:'付款备注'},
  {key:'i',title:'发票状态'},
  {key:'w',title:'已用金额'},
  {key:'u',title:'剩余金额'},

];

const four_controls = [
  {key:'b',title:'订购金额',type:'number',required:true},
];

const four_buttons = [
  {key:'order',title:'订购',bsStyle:'primary'},
  {key:'pay',title:'支付订单'},
  {key:'input',title:'录入付款'},
  {key:'application',title:'申请发票'},
  {key:'view',title:'查看消费记录'},
];

const four_filters = [
  {key:'c',title:'订单编号',type:'text'},
  {key:'d',title:'发票状态',type:'search'},
  {key:'e',title:'订购时间',type:'date'},
  {key:'f',title:'至',type:'date'},
];

const four_cols = [
  {key:'a',title:'订购金额(元)'},
  {key:'b',title:'文件签署单价(元/份)'},
  {key:'c',title:'有效期'},
];


const four_pay_cols = [
  {key:'a',title:'文件签署单价(元/份)'},
  {key:'b',title:'数量(份)'},
  {key:'c',title:'订购金额(元)'},
];

const payOption = [
  {value:'zhifubao',title:'支付宝'},
  {value:'weixin',title:'微信'},
  {value:'dgzz',title:'对公转账'},
];

const four_pay_controls = [
  {key:'b',title:'请选择支付方式',type:'radioGroup',options:payOption,required:true},
];


const four_input_controls = [
  {key:'a',title:'付款流水号',type:'text',required:true},
  {key:'b',title:'付款时间',type:'date'},
  {key:'c',title:'支付备注',type:'textArea'},
];

const optionApp = [
  {title:'增值税专用发票',value:'1'},
  {title:'普通发票',value:'2'},
];

const four_application_controls_title = [
  {key:'a',title:'请选择开票类型',type:'select',options:optionApp,required:true},
];

const four_application_controls1 = [
  {key:'b',title:'发票抬头',type:'text',required:true},
  {key:'c',title:'纳税人识别号',type:'text',required:true},
  {key:'d',title:'对公账号开户银行',type:'text',required:true},
  {key:'e',title:'对公银行账号',type:'text',required:true},
  {key:'f',title:'公司电话',type:'text',required:true},
  {key:'g',title:'公司地址',type:'text',required:true},
];

const four_application_controls2 = [
  {key:'b',title:'发票抬头',type:'text',required:true},
  {key:'c',title:'纳税人识别号',type:'text',required:true},
];

const four_application_controls3 = [
  {key:'j',title:'收件人',type:'text',required:true},
  {key:'h',title:'收件人手机号',type:'text',required:true},
  {key:'o',title:'省',type:'select',required:true},
  {key:'x',title:'市',type:'select',required:true},
  {key:'k',title:'区/县',type:'select',required:true},
  {key:'y',title:'门牌号',type:'textArea',required:true},
];



const config = {
  one:{
    controls:oneControls,
    LABELS,
    checkItems:[
      {key: 'isNotifiedByEmail', title: '邮件通知'},
      {key: 'isNotifiedByPhone', title: '短信通知'},
    ],
    diaLogOne:{
      title:'修改密码',
      controls:[
        {key: 'oldPassword', title: '旧密码',type:'text',required:true},
        {key: 'newPassword', title: '新密码',type:'text',required:true},
        {key: 'codeType', title: '验证码通知方式',type:'select',options:[{value:'0',title:'邮件'},{value:'1',title:'短信'}],required:true},
        {key: 'code', title: '验证码',type:'text',required:true, btn:{title:"获取验证码",key:'obtain'}},
      ]
    },
    diaLogTwo:{
      title:'修改手机号码',
      controls:[
        {key: 'a', title: '请输入旧手机验证码',type:'text',required:true, btn:{title:"获取验证码",key:'obtain'}},
        {key: 'b', title: '请输入新手机号码',type:'text',required:true},
        {key: 'c', title: '请输入新手机号码收到的验证码',type:'text',required:true, btn:{title:"获取验证码",key:'obtain'}},
      ]
    },
    diaLogThree:{
      title:'修改密码',
      controls:[
        {key: 'a', title: '旧密码',type:'text',required:true},
        {key: 'b', title: '新密码',type:'text',required:true},
        {key: 'c', title: '验证码通知方式',type:'select',options:[{value:'1',title:'邮件'},{value:'2',title:'短信'}],required:true},
        {key: 'd', title: '验证码',type:'text',required:true, btn:{title:"获取验证码",key:'obtain'}},
      ]
    },
    diaLogFour:{
      title:'绑定所属企业',
      controls:[
        {key: 'companyOrder', title: '所属企业编号',type:'text',required:true, btn:{title:"获取企业信息",key:'get'}},
        {key: 'companyName', title: '所属企业名称',type:'readonly'},
      ]
    }
  },
  two:{
    buttons:two_buttons,
    edit:{
      controls:two_controls
    }
  },
  three:{
    tableCols:three_tableCols,
    controls:three_controls,
    buttons:three_buttons,
    filters:[],
    tableItems:[]
  },
  four:{
    tableCols:four_tableCols,
    order: {
      controls:four_controls,
      cols:four_cols
    },
    pay: {
      controls:four_pay_controls,
      cols:four_pay_cols
    },
    input:{
      controls:four_input_controls,
      title:'录入付款',
      width:350
    },
    application:{
      controls:{
        one:four_application_controls_title,
        two_1:four_application_controls1,
        two_2:four_application_controls2,
        three:four_application_controls3,
      }
    },
    buttons:four_buttons,
    filters:four_filters,
    searchConfig,
    searchData:{},
    tableItems:[]
  },
  tabs:[
    {key: 'one', title:'账号设置', close: false},
    {key: 'two', title:'签章管理', close: false},
    {key: 'three',title:'授权管理', close: false},
    {key: 'four', title:'订单管理', close: false},
  ]
};

export default config;
