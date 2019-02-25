import {pageSize, pageSizeType, description, searchConfig} from '../../../gloablConfig';

const filters = [
  {key:'a',title:'企业名称',type:'select'},
  {key:'b',title:'报价类型',type:'select'},
  {key:'c',title:'生效开始日期',type:'date'},
  {key:'d',title:'生效终止日期',type:'date'},
  {key:'e',title:'状态',type:'select'},
  {key:'f',title:'创建日期',type:'date'},
  {key:'g',title:'至',type:'date'},
];

const buttons = [
  {key:'add',title:'新增',bsStyle:'primary'},
  {key:'edit',title:'编辑'},
  {key:'del',title:'删除'}
];

const tableCols = [
  {key:'a',title:'状态'},
  {key:'b',title:'报价编号'},
  {key:'c',title:'报价类型'},
  {key:'d',title:'企业名称'},
  {key:'e',title:'生效开始日期'},
  {key:'f',title:'生效终止日期'},
  {key:'g',title:'计税方式'},
  {key:'h',title:'税率(%)'},
  {key:'i',title:'创建人'},
  {key:'j',title:'创建时间'},
  {key:'k',title:'更新人'},
  {key:'l',title:'更新时间'},
];

const controls = [
  {key:'a',title:'报价编号',type:'readonly'},
  {key:'b',title:'报价类型',type:'select',required:true},
  {key:'c',title:'开放订购',type:'select',required:true},
  {key:'d',title:'客户名称',type:'select',required:true},
  {key:'e',title:'生效开始日期',type:'date',required:true},
  {key:'f',title:'生效终止日期',type:'date',required:true},
  {key:'g',title:'计税方式',type:'readonly',required:true},
  {key:'h',title:'税率(%)',type:'text'},
  {key:'yh',title:'备注',type:'textArea',span:2},
];

const cols = [
  {key:'a',title:'费用项目'},
  {key:'b',title:'价格'},
  {key:'c',title:'计量单位'},
  {key:'d',title:'本期总数量'},
  {key:'e',title:'总金额'},
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
    buttons:[
      {key:'close',title:'关闭'},
      {key:'save',title:'保存'},
      {key:'submit',title:'提交',bsStyle:'primary'},
      ],
    cols
  }
};

export default config;
