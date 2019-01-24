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
  {key: 'signFileSubject', title: '文件主题', type: 'text'},
  {key: 'sponsor', title: '发起人', type: 'text'},
  {key: 'signStartTime', title: '发起时间', type: 'date', rule: {type: '<', key: 'insertTimeEnd'}},
  {key: 'insertTimeEnd', title: '至', type: 'date', rule: {type: '>', key: 'signStartTime'}},
  {key: 'signState', title: '状态', type: 'select', dictionary: 'order_type'},
  {key: 'signFinishTime', title: '完成时间', type: 'date', rule: {type: '<', key: 'pickupTimeTo'}},
  {key: 'pickupTimeTo', title: '至', type: 'date', rule: {type: '>', key: 'signFinishTime'}},
  {key: 'isAddCcSide', title: '是否抄送', type: 'select', options: isOptions}
];

const buttons = [
  {key: 'add', title: '新增', bsStyle: 'primary'},
  {key: 'edit', title: '编辑'},
  {key: 'del', title: '删除', confirm:'是否确定删除'},
  {key: 'signature', title: '签署'},
  {key: 'upload', title: '下载文件'},
  {key: 'view', title: '在线预览'}
];

const tableCols = [
  {key: 'signState', title: '状态', type: 'select', dictionary: 'order_type'},
  {key: 'code', title: '系统编号', link: '20190109'},
  {key: 'signFileSubject', title: '文件主题'},
  {key: 'launchAccountId', title: '发起人'},
  {key: 'signStartTime', title: '发起时间'},
  {key: 'signFinishTime', title: '签署截止时间'},
  {key: 'signAccountId', title: '签署人'},
  {key: 'signExpirationTime', title: '签完时间'},
  {key: 'isAddCcSide', title: '是否抄送', options: isOptions},
];

const config = {
  tabs: [{ key: 'index', title: '签署中心列表', close: false}],
  subTabs: [
    {key: 'mySign', title:'待我签', status: 'mySigned'},
/*    {key: 'hisSign', title:'待他人签', status: 'hisSigned'},
    {key: 'draft', title: '草稿', status: 'draft'},
    {key: 'all', title: '所有', status: 'orders'}*/
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
