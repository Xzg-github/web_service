import {pageSize, pageSizeType, description, searchConfig} from '../../../gloablConfig';

const isOptions = [
  {value: 1, title: '是'},
  {value: 0, title: '否'}
];

const filters = [
  {key:'a',title:'业务项目名称',type:'text'},
];

const tableCols = [
  {key:'a',title:'业务项目编码'},
  {key:'b',title:'业务项目名称'},
  {key:'c',title:'受限于账户余额'},
  {key:'d',title:'描述'},
  {key:'e',title:'创始人'},
  {key:'f',title:'创始时间'},
  {key:'g',title:'更新人'},
  {key:'h',title:'更新时间'},
];

const controls = [
  {key:'a', title:'业务项目名称', type:'text', required:true},
  {key:'b', title:'受限于账户余额', type: 'select', options: isOptions, required:true},
  {key:'c', title:'描述', type:'textArea', span: 2 },
];

const buttons = [
  {key:'add',title:'新增',bsStyle:'primary'},
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
    searchConfig
  },
  edit:{
    controls,
  }
};

export default config;
