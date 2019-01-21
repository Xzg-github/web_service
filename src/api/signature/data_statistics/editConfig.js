import {pageSize, pageSizeType, paginationConfig, searchConfig} from '../../gloablConfig';
import name from '../../dictionary/name';

const buttons = [{key: 'import', title: '导出', bsStyle: 'primary'}];

const filters1 = [
  {key: 'pickupTimeFrom', title: '开始日期', type: 'date', rule: {type: '<', key: 'pickupTimeTo'}},
  {key: 'pickupTimeTo', title: '至', type: 'date', rule: {type: '>', key: 'pickupTimeFrom'}},
];

const filters2 = [
  {key: 'pickupTimeFrom', title: '首个签章签完日期', type: 'date', rule: {type: '<', key: 'pickupTimeTo'}},
  {key: 'pickupTimeTo', title: '至', type: 'date', rule: {type: '>', key: 'pickupTimeFrom'}},
  {key: 'orderNumber', title: '对应订单编号', type: 'text'},
  {key: 'orderStatus', title: '状态', dictionary: name.INPUT_ORDER_STATUS},
  {key: 'sponsor', title: '发起人', type: 'text'},
  {key: 'dateInitiation', title: '发起日期', type: 'date', rule: {type: '<', key: 'dateInitiationTo'}},
  {key: 'dateInitiationTo', title: '至', type: 'date', rule: {type: '<', key: 'dateInitiation'}},
];

const filters3 = [
  {key: 'authenticationType', title: '认证类型', dictionary: name.INPUT_ORDER_STATUS},
  {key: 'dateOfCompletion', title: '认证完成日期', type: 'date',rule: {type: '<', key: 'dateOfCompletionTo'}},
  {key: 'dateOfCompletionTo', title: '至', type: 'date',rule: {type: '<', key: 'dateOfCompletion'}},
  {key: 'orderNumber', title: '对应订单编号', type: 'text'},
  {key: 'authenticationMode', title: '认证模式', dictionary: name.INPUT_ORDER_STATUS},
];

const filters4 = [
  {key: 'noticeDate', title: '通知日期', type: 'date',rule: {type: '<', key: 'noticeDateTo'}},
  {key: 'noticeDateTo', title: '至', type: 'date',rule: {type: '<', key: 'noticeDate'}},
  {key: 'orderNumber', title: '对应订单编号', type: 'text'},
  {key: 'notificationType', title: '通知类型', dictionary: name.INPUT_ORDER_STATUS},
  {key: 'notifyTheInitiator', title: '通知发起人', type: 'text'},
  {key: 'associatedFileTheme', title: '关联文件主题', type: 'text'}
];

const tableCols1 = [
  {key: 'totalFiles', title: '文件总数'},
  {key: 'totalMessages', title: '短信总数'},
  {key: 'authentication_two_elements', title: '人身份验证二元素'},
  {key: 'authentication_three_elements', title: '人身份验证三元素'},
  {key: 'faceRecognition', title: '人脸识别'},
  {key: 'authentication_four_elements', title: '人身份验证三元素'},
  {key: 'paymentVerification', title: '银行卡打款验证'},
  {key: 'cumulativeAmount', title: '累计订购金额'},
  {key: 'amountUsed', title: '累计使用金额'},
  {key: 'balance', title: '剩余金额'},
  {key: 'overdraftAmount', title: '透支金额'}
];

const tableCols2 = [
  {key: 'systemNumber', title: '系统编号'},
  {key: 'status', title: '状态', dictionary: name.INPUT_ORDER_STATUS},
  {key: 'associatedFileTheme', title: '文件主题'},
  {key: 'dateInitiation', title: '发起日期'},
  {key: 'sponsor', title: '发起人'},
  {key: 'pickupTimeFrom', title: '首个签章完成时间'},
  {key: 'orderNumber', title: '对应订单编号'},
  {key: 'expenses', title: '费用金额'},
  {key: 'billingTime', title: '计费时间'},
];

const tableCols3 = [
  {key: 'authenticationType', title: '认证类型', dictionary: name.INPUT_ORDER_STATUS},
  {key: 'authenticationMode', title: '认证模式', dictionary: name.INPUT_ORDER_STATUS},
  {key: 'name', title: '姓名/企业'},
  {key: 'accountNumber', title: '账号(手机号/邮箱)'},
  {key: 'orderNumber', title: '对应订单编号'},
  {key: 'expenses', title: '费用金额'},
  {key: 'billingTime', title: '计费时间'},
];

const tableCols4 = [
  {key: 'notificationType', title: '通知类型', dictionary: name.INPUT_ORDER_STATUS},
  {key: 'noticeDate', title: '通知日期'},
  {key: 'notifyTheInitiator', title: '通知发起人'},
  {key: 'notificationObject', title: '通知对象'},
  {key: 'associatedFileTheme', title: '关联文件主题'},
  {key: 'systemNumber', title: '系统编号'},
  {key: 'orderNumber', title: '对应订单编号'},
  {key: 'expenses', title: '费用金额'},
  {key: 'billingTime', title: '计费时间'},
];



const editConfig = {
  buttons,
  filters1,
  filters2,
  filters3,
  filters4,
  tableCols1,
  tableCols2,
  tableCols3,
  tableCols4,
  dicNames: [name.GOODS_TYPE, name.CANVASSION_MODE, name.ORDER_FROM, name.LOGISTICS_ORDER_TYPE,
    name.INPUT_ORDER_STATUS, name.QUERY_GROUP]
};
export default editConfig
