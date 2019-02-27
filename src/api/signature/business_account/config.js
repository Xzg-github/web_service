import {pageSize, pageSizeType, description, searchConfig} from '../../gloablConfig';
import name from '../../dictionary/name';

const isOptions = [
  {value: 1, title: '是'},
  {value: 0, title: '否'}
];

const filters = [
  { key: 'customerName', title: '客户名称',type: 'select', dictionary: name.CUSTOMER_TYPE},
  { key: 'customerCode', title: '客户编码', type: 'text'},
  { key: 'pickupTimeFrom', title: '订购时间', type: 'date', rule: {type: '<', key: 'pickupTimeTo'}},
  { key: 'pickupTimeTo', title: '至', type: 'date', rule: {type: '>', key: 'pickupTimeFrom'}},
];

const tableCols = [
  { key: 'customerName', title: '客户名称', dictionary: name.CUSTOMER_TYPE},
  { key: 'customerCode', title: '客户编码'},
  { key: 'orderAmount', title: '订购金额'},
  { key: 'usedAmount', title: '已用金额'},
  { key: 'balance', title: '余额'},
  { key: 'overdraft', title: '透支金额', options: isOptions},
  { key: 'isOverdraft', title: '允许透支'},
  { key: 'credits', title: '信用额度'},
  { key: 'orderTime', title: '订购时间'}
];

const buttons = [
  { key: 'order', title: '订购', bsStyle: 'primary'},
  { key: 'creditSetting', title: '信用额度设置'},
  { key: 'viewQuota', title: '查看订购记录'}
];

const customerControls = [
  { key: 'customerName', title: '客户名称', type: 'text'},
  { key: 'customerCode', title: '客户编码', type: 'readonly'},
  { key: 'remarks', title: '备注', type: 'textArea', span: 4},
];

const packageTableCols = [
  { key: 'orderAmount', title: '订购金额'},
  { key: 'unitPrice', title: '文件签署单价'},
  { key: 'validityPeriod', title: '有效期'}
];

const orderControls = [
  {key: 'orderAmount', title: '订购金额', required: true, type: 'text'}
];

const config = {
  index:{
    filters,
    buttons,
    tableCols,
    pageSize,
    pageSizeType,
    description,
    searchConfig
  },
  edit:{
    controls1: customerControls,
    tableCols: packageTableCols,
    controls2: orderControls,
    buttons:[{key:'close',title:'关闭'}, {key: 'pay', title: '立即支付', bsStyle: 'primary'}],
  },
  credits: {
    controls:[
      { key: 'creditSetting', title: '信用额度设置', type: 'radio'}
    ]
  },
  viewQuota: {
    tableCols: [
      { key: 'status', title: '状态', dictionary: name.STATUS},
      { key: 'customerCode', title: '客户编码'},
      { key: 'orderAmount', title: '订购金额'},
      { key: 'unitPrice', title: '文件签署单价'},
      { key: 'validityPeriod', title: '有效期'},
      { key: 'time', title: '订购时间'},
      { key: 'paymentMethod', title: '支付方式'},
      { key: 'serialNumber', title: '支付流水号'},
      { key: 'InvoiceStatus', title: '发票状态'},
      { key: 'usedAmount', title: '已用金额'},
      { key: 'balance', title: '余额'},
    ]
  },
  pay: {
    tableCols: [
      { key: 'a', title: '文件签署单价'},
      { key: 'b', title: '数量'},
      { key: 'c', title: '订购金额'}
    ],
    controls:[
      { key: 'alipay', title: '支付宝', type: 'radio'},
      { key: 'weChat', title: '微信', type: 'radio'},
      { key: 'publicAccounts', title: '对公账户', type: 'radio'}
    ]
  }
};

export default config;
