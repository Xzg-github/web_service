import {pageSize, pageSizeType, description, searchConfig} from '../../gloablConfig';

const isYesOrNo = [
  {title:'是',value:1},
  {title:'否',value:0}
];

const filters = [
  {key:'a',title:'文件主题',type:"text"},
  {key:'b',title:'发起人',type:"text"},
  {key:'c',title:'发起时间',type:"date"},
  {key:'d',title:'至',type:"date"},
  {key:'e',title:'是否抄送',type:"select",options:isYesOrNo},
  {key:'f',title:'系统编号',type:'text'}
];

const tableCols = [
  {key:'a',title:'系统编号',link:true},
  {key:'b',title:'文件主题',link:true},
  {key:'c',title:'发起人'},
  {key:'d',title:'发起时间'},
  {key:'e',title:'是否抄送'},
];

const buttons = [
  {key:'move',title:'移动文件',bsStyle:'primary'},
  {key:'download',title:'下载'}
];

const treeButtons = [
  {key:'file',title:'管理文件夹'},
];

const fileButtons = [
  {key:'add',title:'新增'},
  {key:'edit',title:'编辑'},
  {key:'del',title:'删除'},
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
  }
};

export default config;
