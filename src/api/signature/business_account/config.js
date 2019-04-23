import {pageSize, pageSizeType, description, searchConfig} from '../../gloablConfig';

//是否允许透支
const creditSettingOptions = [
  {value: 1, title: '是'},
  {value: 0, title: '否'}
];

//订单状态
const statusOptions = [
  {value: 0, title: '未支付'},
  {value: 1, title: '支付成功'}
];

//有效期
const effectiveOptions = [
  {value: 1, title: '长期有效'}
];

const unitOptions = [
  {value:'second',title:'次'},
  {value:'strip',title:'条'},
];

//支付方式
const payOptions = [
  {value:'1',title:'支付宝'},
  {value:'2',title:'微信'},
  {value:'3',title:'对公转账'},
];

const fourControls = [
  {key:'b',title:'请选择支付方式',type:'radioGroup',options:payOptions,required:true},
];

const filters = [
  { key: 'companyId', title: '企业名称',type: 'search'},
  { key: 'companyOrder', title: '企业编号', type: 'text'},
/*  { key: 'orderTimeFrom ', title: '订购时间', type: 'date', rule: {type: '<', key: 'orderTimeTo'}, props:{showTime: true}},
  { key: 'orderTimeTo', title: '至', type: 'date', rule: {type: '>', key: 'orderTimeFrom'}, props:{showTime: true}},*/
];

const tableCols = [
  { key: 'companyName', title: '企业名称'},
  { key: 'companyOrder', title: '企业编号'},
   { key: 'companyAccountAmount', title: '帐户可用金额'},
  { key: 'companyAccountBuyAmount', title: '累计订购金额'},
  { key: 'companyAccountUsedAmount', title: '累计已用金额'},
  { key: 'companyBuyLeftAmount', title: '订购剩余金额'},
  { key: 'isOverdraft', title: '允许透支', options: creditSettingOptions},
  { key: 'companyCreditInit', title: '信用额度上限'},
  { key: 'companyCreditUsed', title: ' 已用额度'},
  { key: 'companyCreditLeft', title: '剩余可用额度'},
  //{ key: 'recentOrderingTime', title: '最近订购时间 '}
];

const buttons = [
  { key: 'creditSetting', title: '信用额度设置', bsStyle: 'primary'},
  { key: 'order', title: '代企业订购'},
  { key: 'viewQuota', title: '查看订购记录'}
];

//OrderPage 配置
const index = {filters, buttons, tableCols, pageSize, pageSizeType, description, searchConfig};

//订购页面 Form1配置
const customerControls = [
  { key: 'companyName', title: '客户名称', type: 'text'},
  { key: 'companyOrder', title: '客户编码', type: 'readonly', span: 2},
  //{ key: 'remarks', title: '备注', type: 'textArea', span: 4},
];

//订购页面 SuperTable配置
const packageTableCols = [
  {key:'ruleName',title:'套餐名称'},
  {key:'businessItemId',title:'业务项目'},
  {key:'price',title:'价格(元)'},
  {key:'unitType',title:'单位',options:unitOptions},
  {key:'effectiveType',title:'有效期',options:effectiveOptions},
];

//订购页面 Form2配置
const orderControls = [
  {key: 'orderMoney', title: '订购金额', required: true, type: 'number'}
];

const config = {
  index,

  //订购页面所有配置信息
  edit:{
    controls1: customerControls,
    tableCols: packageTableCols,
    controls2: orderControls,
    buttons: [{key:'close',title:'关闭'}, {key: 'pay', title: '立即支付', bsStyle: 'primary'}],
  },

  // 信用额度设置
  credits: {
    controls:[
      {key: 'isOverdraft', title: '是否允许透支', type: 'radioGroup', options: creditSettingOptions, required: true}
    ],
    cascade: [{key: 'companyCreditInit', title: '信用额度上限', type: 'number', required: true}]
  },

  //查看订购记录
  viewQuota: {
    tableCols: [
      { key: 'orderStatus', title: '订单状态', options: statusOptions},
      { key: 'nativeOrderNo', title: '订单编号'},
      { key: 'orderMoney', title: '订购金额'},
      { key: 'unitPrice', title: '文件签署单价'},
      { key: 'effectiveType', title: '有效期', options: effectiveOptions},
      { key: 'orderTime', title: '订购时间'},
      { key: 'payWay', title: '支付方式', options: payOptions},
      { key: 'outerOrderNo', title: '支付流水号'},
      { key: 'invoiceStatus', title: '发票状态'},
      { key: 'usedMoney', title: '已用金额'},
      { key: 'leftMoney', title: '余额'},
    ]
  },

  pay: {
    tableCols: [
      {key:'unitPrice',title:'文件签署单价(元/份)'},
      {key:'number',title:'数量(份)'},
      {key:'orderMoney',title:'订购金额(元)'},
    ],
    controls: fourControls
  },
};

export default config;
