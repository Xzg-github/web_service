import {pageSize, pageSizeType, description, searchConfig} from '../../gloablConfig';

//orderStatus Options
const orderStatusOptions = [
  {value: 0, title: '未支付'},
  {value: 1, title: '已支付'}
];

//invoiceStatus Options
const invoiceStatusOptions = [
  {value: 0, title: '已申请'},
  {value: 1, title: '已开具未邮寄'},
  {value: 2, title: '已开具并邮寄'},
  {value: 3, title: '已收到'}
];

//payWay Options
const payWayOptions = [
  {value: 1, title: '微信支付'},
  {value: 2, title: '支付宝'},
  {value: 3, title: '网银支付'}
]

/** OrderPage Config Information **/
const filters = [
  {key: 'nativeOrderNo', title: '订单编号', type: 'text'},
  {key: 'companyId', title: '企业名称', type: 'search'},
  {key: 'orderTimeFrom', title: '订购时间', type: 'date'},
  {key: 'orderTimeTo', title: '至', type: 'date'},
  {key: 'orderStatus', title: '订单状态', type: 'select', options: orderStatusOptions},
  {key: 'invoiceStatus', title: '发票状态', type: 'select', options: invoiceStatusOptions}
];

const buttons = [
  //{key: 'receipt', title: '录入收款', bsStyle: 'primary'},
  {key: 'audit', title: '审核', confirm: '审核通过后订单生效，确定审核通过吗？'},
  {key: 'record', title: '查看消费记录'}
];

const tableCols = [
  {key: 'orderStatus', title: '订单状态', options: orderStatusOptions},
  {key: 'nativeOrderNo', title: '订单编号', link: true},
  {key: 'companyName', title: '客户名称'},
  {key: 'orderMoney', title: '订购金额'},
  {key: 'usedMoney', title: '已用金额'},
  {key: 'orderTime', title: '订购时间'},
  {key: 'payWay', title: '支付方式', options: payWayOptions},
  {key: 'outerOrderNo', title: '支付流水号'},
  {key: 'payDescription', title: '支付备注'},
  {key: 'applyStatus', title: '发票状态', options: invoiceStatusOptions}
];

const index = {
  filters, buttons, tableCols, description, searchConfig, pageSizeType, pageSize
};

/** EditDialog Config Information **/
const controls = [
  {key: 'outerOrderNo', title: '付款流水号', type: 'text', required: true},
  {key: 'orderTime', title: '付款时间', type: 'date', props: {showTime: true}},
  {key: 'payDescription', title: '支付备注', type: 'textArea'}
];

const editDialogConfig = {
  title: '录入收款', controls, config: {ok: '确定', cancel: '取消'}
};

const config = {
  index, editDialogConfig
};

export default config;


