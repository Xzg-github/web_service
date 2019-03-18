import {pageSize, pageSizeType, description, searchConfig} from '../../../gloablConfig';

const isOptions = [
  {value: 0, title: '禁用'},
  {value: 1, title: '待认证'},
  {value: 2, title: '认证失败'},
  {value: 3, title: '已认证'},
  {value: 4, title: '已启用'},
  {value: 5, title: '已审核'},
  {value: 6, title: '待审核'}
];

const filters = [
  {key:'realName',title:'真实姓名',type:'text'},
  {key:'idNumber',title:'注册账号',type:'text'},
  {key:'notifyPhone',title:'手机号码',type:'number'},
  {key:'userAccountState',title:'账号状态',type: 'select', options: isOptions},
  {key:'notifyEmail',title:'电子邮件',type:'text'},
];

const tableCols = [
  {key:'userAccountState',title:'账号状态', type: 'select', options: isOptions},
  {key:'idNumber',title:'注册账号'},
  {key:'realName',title:'真实姓名'},
  {key:'notifyEmail',title:'电子邮件'},
  {key:'notifyPhone',title:'手机号码'},
  {key:'userAccountNote',title:'备注'},
  {key:'insertUser',title:'操作人'},
  {key:'insertTime',title:'操作时间'},
];

const buttons = [
  // {key:'add',title:'新增',bsStyle:'primary'},
  // {key:'invitation',title:'发起邀请'},
  {key:'examine',title:'审核', bsStyle: 'primary'},
  //{key:'edit',title:'编辑'},
  //{key:'del',title:'删除'},
  {key:'enable',title:'启用'},
  {key:'disable',title:'禁用'},
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
  edit: {
    config: {ok: '通过', cancel: '关闭', reject: '拒绝'}
  }
};

export default config;
