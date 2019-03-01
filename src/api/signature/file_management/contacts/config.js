import {pageSize, pageSizeType, description, searchConfig} from '../../../gloablConfig';

const state_options = [
  {value:0,title:'待完善'},
  {value:1,title:'已完善'},
]

const filters = [
  {key:'companyContactName',title:'姓名/机构',type:"text"},
  {key:'companyContactAccount',title:'联系人账号',type:"text"},
  {key:'companyContactPhoneNumber',title:'手机号码',type:"number"},
  {key:'companyContactAccountState',title:'状态',type:"select",options:state_options},
  {key:'companyContactGroupId',title:'所属分组',type:"text"},
  {key:'companyContactEmail',title:'电子邮件',type:'text'}
];

const tableCols = [
  {key:'companyContactAccountState',title:'状态',options:state_options},
  {key:'companyContactName',title:'真实姓名/机构名称'},
  {key:'companyContactAccount',title:'账号'},
  {key:'companyContactEmail',title:'电子邮件'},
  {key:'companyContactPhoneNumber',title:'手机号码'},
  {key:'companyContactGroupId',title:'所属分组'},
  {key:'invitationTime',title:'发送时间'},
  {key:'isInvitation',title:'是否发送邀请'},
  {key:'updateTime',title:'更新时间'},
  {key:'updateUser',title:'更新人员'},
];

const buttons = [
  {key:'add',title:'新增',bsStyle:'primary'},
  {key:'edit',title:'编辑'},
  {key:'del',title:'删除'},
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
  {key:'companyContactName',title:'姓名/机构名称',type:'text',required:true},
  {key:'companyContactAccount',title:'账号',type:'text'},
  {key:'companyContactEmail',title:'电子邮件',type:'text'},
  {key:'companyContactPhoneNumber',title:'手机号码',type:'number'},
  {key:'companyContactGroupId',title:'所属分组',type:'readonly',required:true},
  {key:'companyContactNote',title:'备注',type:'textArea',span:2},
];


const config = {
  index:{
    filters,
    buttons,
    tableCols,
    currentPage:1,
    pageSize,
    pageSizeType,
    description,
    searchConfig,
    searchData:{},
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
