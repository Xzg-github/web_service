import {pageSize, pageSizeType, description, searchConfig} from '../../../gloablConfig';

const person = '/api/signature/account_management/enterprise_account_management/dropPerson';

const oneControls = [

  {key:'dgyhzh',title:'对公银行账号',type:'text',required:true, btn:{title:"获取验证码",key:'code'}},

  {key:'dgyhmc',title:'对公银行名称',type:'text',required:true},

  {key:'dgyykhzh',title:'对公开户支行',type:'text',required:true,props:{
    placeholder:'请填写完整的支行名称'
  }},
];


const LABELS = [
  {key: 'grzh', title: '企业账号'},
  {key: 'companyOrder', title: '企业编号'},
  {key: 'companyName', title: '企业名称'},
  {key: 'companyContact', title: '法人姓名'},
  {key: 'notifyPhone', title: '手机号码'},
  {key: 'companyContactPhone', title: '企业电话'},
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
  {key:'enable',title:'启用'},
  {key:'disable',title:'禁用'},
];


const authOptions = [
  {value:0,title:'禁用'},
  {value:1,title:'启用'},
];

const three_tableCols = [
  {key:'authStatus',title:'状态',options:authOptions},
  {key:'userAccountId',title:'真实姓名'},
  {key:'account',title:'账号'},
  {key:'signSealId',title:'授权签章名称'},
  {key:'updateUser',title:'操作人'},
  {key:'updateTime',title:'操作时间'},
  {key:'insertUser',title:'创建人'},
  {key:'insertTime',title:'创建时间'},

];

const three_controls = [
  {key:'userAccountId',title:'请选择被授权人',type:'search',searchUrl:person,required:true},
  {key:'account',title:'授权人账号',type:'readonly'},
  {key:'signSealId',title:'授权签章',type:'select',required:true},
];

const statusOptions = [
  {value:0,title:'未支付'},
  {value:1,title:'已支付'}
];

const invoiceOptions = [
  {value:0,title:'未支付'},
  {value:1,title:'已支付成功'},
];

const payOptions = [
  {value:1,title:'微信'},
  {value:2,title:'支付宝'},
  {value:3,title:'网银'}
];

const four_tableCols = [
  {key:'orderStatus',title:'订单状态',options:statusOptions},
  {key:'nativeOrderNo',title:'订单编号'},
  {key:'orderMoney',title:'订购金额'},
  {key:'insertTime',title:'订购时间'},
  {key:'payWay',title:'支付方式',options:payOptions},
  {key:'outerOrderNo',title:'付款流水号'},
  {key:'payTime',title:'付款时间'},
  {key:'payDescription',title:'付款备注'},
  {key:'invoiceStatus',title:'发票状态',options:invoiceOptions},
  {key:'usedMoney',title:'已用金额'},
  {key:'leftMoney',title:'剩余金额'},

];

const four_controls = [
  {key:'orderMoney',title:'订购金额',type:'number',required:true},
];

const four_buttons = [
  {key:'order',title:'订购',bsStyle:'primary'},
  // {key:'pay',title:'支付订单'},
  {key:'look',title:'查看消费记录'},
];

const four_filters = [
  {key:'nativeOrderNo',title:'订单编号',type:'text'},
  {key:'orderStatus',title:'订单状态',type:'select',options:statusOptions},
  {key:'orderTimeFrom',title:'订购时间',type:'date',props:{showTime:true}},
  {key:'orderTimeTo',title:'至',type:'date',props:{showTime:true}},
];

const unitOptions = [
  {value:'second',title:'次'},
  {value:'strip',title:'条'},
];

const effectOptions = [
  {value:1,title:'长期有效'}
];

const four_cols = [
  {key:'ruleName',title:'套餐名称'},
  {key:'businessItemId',title:'业务项目'},
  {key:'price',title:'价格(元)'},
  {key:'unitType',title:'单位',options:unitOptions},
  {key:'effectiveType',title:'有效期',options:effectOptions},
];


const four_pay_cols = [
  {key:'unitPrice',title:'文件签署单价(元/份)'},
  {key:'number',title:'数量(份)'},
  {key:'orderMoney',title:'订购金额(元)'},
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


const four_look_controls = [
  {key:'nativeOrderNo',title:'订单编号',type:"readonly"},
  {key:'orderTime',title:'订购日期',type:"readonly"},
  {key:'orderMoney',title:'订购金额',type:"readonly"},
  {key:'consumerTotalAmount',title:'消费总额',type:"readonly"},
];

const four_look_tableCols1 = [
  {key:'itemName',title:'业务项目'},
  {key:'totalNum',title:'数量合计'},
  {key:'totalAmount',title:'金额合计'},
];

const four_look_tableCols2 = [
  {key:'itemName',title:'业务项目'},
  {key:'consumerTime',title:'时间'},
  {key:'predictPrice',title:'价格'},
  {key:'unitType',title:'单位',options:unitOptions},
  {key:'price',title:'实际扣费'},
  {key:'fileNo',title:'关联系统编号'},
  {key:'executor',title:'发起人'},
];

const optionApp = [
  {title:'增值税专用发票',value:'1'},
  {title:'普通发票',value:'2'},
];

const four_application_controls_title = [
  {key:'a',title:'请选择开票类型',type:'radioGroup',options:optionApp,required:true},
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
    pageSize,
    pageSizeType,
    description,
    searchConfig,
    filters:[],
    searchData:{},
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
    look:{
      controls:four_look_controls,
      cols1:four_look_tableCols1,
      cols2:four_look_tableCols2,
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
    pageSize,
    pageSizeType,
    description,
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
