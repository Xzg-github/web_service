import {pageSize, pageSizeType, description, searchConfig} from '../../../gloablConfig';

const filters = [
  {key:'a',title:'真实姓名',type:'text'},
  {key:'b',title:'注册账号',type:'text'},
  {key:'c',title:'手机号码',type:'number'},
  {key:'d',title:'账号状态',type:'select'},
  {key:'f',title:'电子邮件',type:'text'},
];

const tableCols = [
  {key:'a',title:'账号状态'},
  {key:'b',title:'注册账号'},
  {key:'c',title:'真实姓名'},
  {key:'d',title:'电子邮件'},
  {key:'e',title:'手机号码'},
  {key:'f',title:'备注'},
  {key:'g',title:'操作人'},
  {key:'h',title:'操作时间'},
];

const controls = [
  {key:'a',title:'真实姓名',type:'text',required:true},
  {key:'b',title:'电子邮件',type:'text',required:true},
  {key:'c',title:'手机号码',type:'number'},
  {key:'d',title:'客户编号',type:'text'},
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
  edit:{
    controls,
  }
};

export default config;
