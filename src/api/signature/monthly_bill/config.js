import {pageSize, pageSizeType, description, searchConfig} from '../../gloablConfig';

const filters = [
  {key:'a',title:'状态',type:'select'},
  {key:'b',title:'账单编号',type:'text'},
  {key:'c',title:'账期开始日期',type:'date'},
  {key:'d',title:'账期结束日期',type:'date'},
];


const tableCols = [
  {key:'a',title:'账单编号',link:true},
  {key:'b',title:'账单名称'},
  {key:'c',title:'账单开始日期'},
  {key:'d',title:'账单结束日期'},
  {key:'e',title:'上期账户余额'},
  {key:'f',title:'本期账户充值'},
  {key:'g',title:'本期账单支出'},
  {key:'h',title:'本期账户余额'},
  {key:'i',title:'发送人'},
  {key:'j',title:'发送时间'},
  {key:'k',title:'审核人'},
  {key:'l',title:'审核时间'},
];

const controls = [
  {key:'a',title:'账单开始时间',type:'readonly'},
  {key:'b',title:'账单结束时间',type:'readonly'},
  {key:'c',title:'客户名称',type:'readonly'},
  {key:'d',title:'客户编号',type:'readonly'},
  {key:'e',title:'上期账户余额',type:'readonly'},
  {key:'f',title:'本期账户充值',type:'readonly'},
  {key:'g',title:'本期账单支出',type:'readonly'},
  {key:'h',title:'本期账户余额',type:'readonly'},
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
    buttons:[],
    tableCols,
    pageSize,
    pageSizeType,
    description,
    searchConfig
  },
  edit:{
    controls,
    buttons:[{key:'close',title:'关闭'}],
    cols
  }
};

export default config;
