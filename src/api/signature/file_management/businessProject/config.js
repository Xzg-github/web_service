import {pageSize, pageSizeType, description, searchConfig} from '../../../gloablConfig';

const isOptions = [
  {value: 1, title: '是'},
  {value: 0, title: '否'}
];

const filters = [
  {key:'itemName',title:'业务项目名称',type:'text'},
];

const tableCols = [
  {key:'code',title:'业务项目编码'},
  {key:'itemName',title:'业务项目名称'},
  {key:'limitedItem',title:'受限于账户余额', type: 'select', options: isOptions},
  {key:'description',title:'描述'},
  {key:'insertUser',title:'创始人'},
  {key:'insertTime',title:'创始时间'},
  {key:'updateUser',title:'更新人'},
  {key:'updateTime',title:'更新时间'},
];

const controls = [
  {key:'itemName', title:'业务项目名称', type:'text', required:true},
  {key:'limitedItem', title:'受限于账户余额', type: 'select', options: isOptions, required:true},
  {key:'description', title:'描述', type:'textArea', span: 2 },
];

const buttons = [
  {key:'add',title:'新增',bsStyle:'primary'},
  {key:'edit',title:'编辑'},
  {key:'del',title:'删除', confirm:'是否确定删除'},
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
