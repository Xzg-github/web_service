import {pageSize, pageSizeType, description, searchConfig} from '../../../gloablConfig';

const filters = [
  {key:'a',title:'模板名称',type:'text'},
  {key:'b',title:'创建人',type:'text'},
  {key:'c',title:'创建时间',type:'date'},
  {key:'d',title:'至',type:'date'},
];


const tableCols = [
  {key:'a',title:'模板编号'},
  {key:'t',title:'模板名称'},
  {key:'b',title:'模板说明'},
  {key:'c',title:'创建人'},
  {key:'d',title:'创建时间'},
  {key:'g',title:'更新人'},
  {key:'e',title:'更新时间'},
];

const controls = [
  {key:'a',title:'模板名称',type:'text',required:true,span:2},
  {key:'b',title:'模板说明',type:'textArea',span:2},
];

const buttons = [
  {key:'add',title:'新增',bsStyle:'primary'},
  {key:'del',title:'删除'},
  {key:'line',title:'在线填写内容'},
  {key:'download',title:'下载'},
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
