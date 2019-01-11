import {pageSize, pageSizeType, description, paginationConfig, searchConfig, okText, cancelText} from '../../gloablConfig';
import name from '../../dictionary/name';

const isOptions = [
  {value: 1, title: '是'},
  {value: 0, title: '否'}
];

const isOptions1 = [
  {value: 1, title: '代表个人'},
  {value: 0, title: '代表企业'}
];

const filters = [
  {key: 'fileTheme', title: '文件主题', type: 'text'},
  {key: 'sponsor', title: '发起人', type: 'text'},
  {key: 'insertTimeStart', title: '发起时间', type: 'date', rule: {type: '<', key: 'insertTimeEnd'}},
  {key: 'insertTimeEnd', title: '至', type: 'date', rule: {type: '>', key: 'insertTimeStart'}},
  {key: 'status', title: '状态', type: 'select', dictionary: 'order_type'},
  {key: 'pickupTimeFrom', title: '完成时间', type: 'date', rule: {type: '<', key: 'pickupTimeTo'}},
  {key: 'pickupTimeTo', title: '至', type: 'date', rule: {type: '>', key: 'pickupTimeFrom'}},
  {key: 'copy', title: '是否抄送', type: 'select', options: isOptions}
];

const buttons = [
  {key: 'add', title: '新增', bsStyle: 'primary'},
  {key: 'edit', title: '编辑'},
  {key: 'del', title: '删除', confirm:'是否确定删除'},
  {key: 'signature', title: '签章'},
  {key: 'upload', title: '下载文件'}
];

const tableCols = [
  {key: 'status', title: '状态', type: 'select', dictionary: 'order_type'},
  {key: 'systemNumber', title: '系统编号', link: '20190109'},
  {key: 'associatedFileTheme', title: '文件主题'},
  {key: 'sponsor', title: '发起人'},
  {key: 'insertTimeStart', title: '发起时间'},
  {key: 'insertTimeEnd', title: '签署截止时间'},
  {key: 'signatory', title: '签署人'},
  {key: 'completeTime', title: '签完时间'},
  {key: 'copy', title: '是否抄送', options: isOptions},
];

const config = {
  tabs: [{ key: 'index', title: '签署中心列表', close: false}],
  subTabs: [
    {key: 'mySign', title:'待我签', status: 'mySigned'},
    {key: 'hisSign', title:'已提交', status: 'hisSigned'},
    {key: 'draft', title: '草稿', status: 'draft'},
    {key: 'all', title: '所有', status: 'orders'}
  ],
  activeKey: 'index',
  subActiveKey: 'mySign',
  isTotal: true,
  searchData: {},
  searchDataBak: {},
  filters,
  buttons,
  tableCols,
  initPageSize: pageSize,
  pageSizeType,
  description,
  searchConfig,
  paginationConfig,
  showConfig: {
    tableCols: [
      {key: 'sign', title: '顺序签'},
      { key: 'mechanism', title: '姓名/机构',type: 'text'},
      { key: 'accountNumber', title: '账号', type: 'text'},
      { key: 'whether', title: '允许增加签署方', type: 'select', options: isOptions},
      { key: 'identity', title: '签署身份', type: 'select', options: isOptions1},
      { key: 'signTime', title: '签署时间'},
      { key: 'signingOpinions', title: '签署意见', type: 'text'},
      { key: 'sendLink', title: '链接', link: '发送链接'},
      { key: 'notice', title: '提醒', link: '点击提醒'}
    ],
  }
};

export default config
