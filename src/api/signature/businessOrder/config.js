import {pageSize, pageSizeType, description, searchConfig} from '../../gloablConfig';

/** OrderPage Config Information **/
const filters = [
  {key: 'orderNumber', title: '订单编号', type: 'text'},
  {key: 'customerName', title: '客户名称', type: 'search'},
  {key: 'purchaseTimeFrom', title: '订购时间', type: 'date'},
  {key: 'purchaseTimeTo', title: '至', type: 'date'},
  {key: 'orderStatus', title: '订单状态', type: 'search'},
  {key: 'invoiceStatus', title: '发票状态', type: 'search'}
];

const buttons = [
  {key: 'receipt', title: '录入收款', bsStyle: 'primary'},
  {key: 'audit', title: '审核', confirm: '审核通过后订单生效，确定审核通过吗？'},
  {key: 'record', title: '查看消费记录'}
];

const tableCols = [
  {key: 'orderStatus', title: '订单状态'},
  {key: 'orderNumber', title: '订单编号', link: true},
  {key: 'customerName', title: '客户名称'},
  {key: 'purchaseAmount', title: '订购金额'},
  {key: 'usedAmount', title: '已用金额'},
  {key: 'purchaseTime', title: '订购时间'},
  {key: 'payMode', title: '支付方式'},
  {key: 'payNumber', title: '支付流水号'},
  {key: 'payMark', title: '支付备注'},
  {key: 'invoiceStatus', title: '发票状态'}
];

const index = {
  filters, buttons, tableCols, description, searchConfig, pageSizeType, pageSize
};

/** EditDialog Config Information **/
const controls = [
  {key: 'paymentNumber', title: '付款流水号', type: 'text', required: true},
  {key: 'paymentTime', title: '付款时间', type: 'date', props: {showTime: true}},
  {key: 'paymentMark', title: '支付备注', type: 'textArea'}
];

const editDialogConfig = {
  title: '录入收款', controls, config: {ok: '确定', cancel: '取消'}
};

/** EditPage Config Information **/
const baseInfo = [
  {key: 'orderNumber', title: '订单编号', type: 'readonly'},
  {key: 'purchaseTimeFrom', title: '订购时间', type: 'readonly'},
  {key: 'purchaseAmount', title: '订购金额', type: 'readonly'},
  {key: 'consumptionAmount', title: '消费总额', type: 'readonly'}
];

const consumptionStatisticsInfo = [
  {key: 'operationProject', title: '业务项目'},
  {key: 'amountTotal', title: '数量合计'},
  {key: 'amountTotal', title: '金额合计'}
];

const consumptionDetail = [
  {key: 'operationProject', title: '业务项目'},
  {key: 'time', title: '时间'},
  {key: 'unit', title: '单位'},
  {key: 'cost', title: '费用'}
];

const editPageButton = [
  {key: 'close', title: '关闭'},
  {key: 'export', title: '导出明细'}
];

const editPageConfig = {
  baseInfo, consumptionStatisticsInfo, consumptionDetail, editPageButton, description, pageSize, pageSizeType
};

const tabs = [
  {key: 'index', title: '企业订单列表', close: false}
];

const config = {
  index, editDialogConfig, editPageConfig, tabs, activeKey: 'index'
};

export default config;


