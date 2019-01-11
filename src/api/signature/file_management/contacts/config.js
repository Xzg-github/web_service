import {pageSize, pageSizeType, description, searchConfig} from '../../../gloablConfig';

const filters = [
  {key:'a',title:'姓名/机构',type:"text"},
  {key:'b',title:'联系人账号',type:"text"},
  {key:'c',title:'手机号码',type:"number"},
  {key:'d',title:'状态',type:"select"},
  {key:'e',title:'本机构用户',type:"search"},
  {key:'f',title:'电子邮件',type:'text'}
];



const tableCols = [
  {key:'a',title:'状态'},
  {key:'b',title:'真实姓名/机构名称'},
  {key:'c',title:'账号'},
  {key:'d',title:'电子邮件'},
  {key:'e',title:'手机号码'},
  {key:'f',title:'归属机构'},
  {key:'g',title:'所属分组'},
  {key:'h',title:'备注'},
  {key:'i',title:'操作人'},
  {key:'j',title:'操作时间'},
];

const buttons = [
  {key:'add',title:'新增',bsStyle:'primary'},
  {key:'invitation',title:'发起邀请'},
  {key:'edit',title:'编辑'},
  {key:'del',title:'删除'},
  {key:'staff',title:'引入企业员工'},
];

const treeButtons = [
  {key:'file',title:'管理文件夹'},
];

const fileButtons = [
  {key:'add',title:'新增'},
  {key:'edit',title:'编辑'},
  {key:'del',title:'删除'},
];

const controls = [
  {key:'a',title:'姓名/机构名称',type:'text',required:true},
  {key:'b',title:'账号',type:'text'},
  {key:'t',title:'电子邮件',type:'text'},
  {key:'c',title:'手机号码',type:'number'},
  {key:'d',title:'所属分组',type:'select'},
  {key:'e',title:'备注',type:'text'},
];


const config = {
  index:{
    filters,
    buttons,
    tableCols,
    pageSize,
    pageSizeType,
    description,
    searchConfig,
    treeButtons
  },
  root:'全部文件',
  file:{
    buttons:fileButtons
  },
  edit:{
    controls
  }
};

export default config;
