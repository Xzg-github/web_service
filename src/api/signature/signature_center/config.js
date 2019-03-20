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

const isOptions2 = [
  {value:'draft', title: '草稿'},
  {value:'wait', title: '待签'},
  {value: 'sign', title: '已签署'},
  {value: 'completed', title: '已完成'}
];

const filters = [
  {key: 'signFileSubject', title: '文件主题', type: 'text'},
  //{key: 'launchAccountId', title: '发起人', type: 'text'},
  {key: 'signStartTimeFrom', title: '发起时间', type: 'date', rule: {type: '<', key: 'signStartTimeTo'}},
  {key: 'signStartTimeTo', title: '至', type: 'date', rule: {type: '>', key: 'signStartTimeFrom'}},
  {key: 'fileState', title: '状态', type: 'select', options: isOptions2},
  {key: 'signFinishTimeFrom', title: '完成时间', type: 'date', rule: {type: '<', key: 'signExpirationTimeTo '}},
  {key: 'signFinishTimeTo', title: '至', type: 'date', rule: {type: '>', key: 'signExpirationTimeFrom'}},
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

const buttons2 = [
  {key: 'add', title: '新增', bsStyle: 'primary'},
  {key: 'del', title: '删除', confirm:'是否确定删除'},
  {key: 'signature', title: '签署'},
  {key: 'upload', title: '下载文件'},
  {key: 'view', title: '在线预览'}
];

const tableCols = [
  {key: 'signFileOrder', title: '文件编号',link: true},
  {key: 'signFileSubject', title: '文件主题'},
  {key: 'fileState', title: '状态', options: isOptions2},
  {key: 'signStartTime', title: '发起时间'},
  {key: 'launchAccountId', title: '签署人'},
  {key: 'signFinishTime', title: '签完时间'},
  {key: 'signExpirationTime', title: '签署截止时间'},
  {key: 'isAddCcSide', title: '是否抄送', options: isOptions},
  {key: 'insertUser', title: '创建人'},
];

const config = {
  tabs: [{ key: 'index', title: '签署中心列表', close: false}],
  subTabs: [
    {key: 'mySign', title:'待我签', status: 'wait'},
    {key: 'hisSign', title:'待他人签', status: 'wait'},
    {key: 'draft', title: '草稿', status: 'draft'},
    {key: 'all', title: '所有', status: 'all'}
  ],
  activeKey: 'index',
  subActiveKey: 'mySign',
  isTotal: true,
  searchData: {},
  searchDataBak: {},
  filters,
  buttons,
  buttons2,
  tableCols,
  initPageSize: pageSize,
  pageSizeType,
  description,
  searchConfig,
  paginationConfig,
  showConfig: {
    tableCols: [
      {key: 'sequence', title: '签署顺序'},
      { key: 'signPartyName', title: '姓名/机构',type: 'text'},
      { key: 'account', title: '账号', type: 'text'},
      { key: 'signIdentity', title: '签署身份', type: 'select', options: isOptions1},
      //{ key: 'isAllowAddSignatories', title: '允许增加签署方', type: 'select', options: isOptions},
     // { key: 'signTime', title: '签署时间'},
      //{ key: 'signingOpinions', title: '签署意见', type: 'text'},
     // { key: 'sendLink', title: '链接', link: '发送链接'},
      //{ key: 'notice', title: '提醒', link: '点击提醒'}
    ],
  }
};

export default config
