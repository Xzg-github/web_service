import {pageSize, pageSizeType, description, searchConfig} from '../../gloablConfig';

const statusOptions = [
  {value:0,title:'待发送'},
  {value:1,title:'已发送'},
];

const unitOptions = [
  {value:'second',title:'次'},
  {value:'strip',title:'条'},
];

const filters = [
  {key:'companyId',title:'客户名称',type:'select'},
  {key:'monthBillCode',title:'账单编号',type:'text'},
  {key:'startTime',title:'账期开始日期',type:'date'},
  {key:'endTime',title:'账期结束日期',type:'date'},
  {key:'statusType',title:'状态',type:'select'},
  {key:'insertTimeFrom',title:'创建日期',type:'date'},
  {key:'insertTimeTo',title:'至',type:'date'},
  {key:'insertUser',title:'创建人',type:'text'},
];

const tableCols = [
  {key:'statusType',title:'状态',options:statusOptions},
  {key:'monthBillCode',title:'账单编号',link:true},
  {key:'companyId',title:'客户名称'},
  {key:'startTime',title:'账单开始日期'},
  {key:'endTime',title:'账单结束日期'},
  {key:'previousAccountBalance',title:'上期账户余额'},
  {key:'currentAccountRecharge',title:'本期账户充值'},
  {key:'currentBillExpenditure',title:'本期账单支出'},
  {key:'currentAccountBalance',title:'本期账户余额'},
  {key:'insertUser',title:'创建人'},
  {key:'insertTime',title:'创建时间'},
  {key:'updateUser',title:'操作人'},
  {key:'updateTime',title:'操作时间'},
];

const controls = [
  {key:'startTime',title:'账单开始时间',type:'readonly'},
  {key:'endTime',title:'账单结束时间',type:'readonly'},
  {key:'companyId',title:'客户名称',type:'readonly'},
  {key:'companyOrder',title:'客户编号',type:'readonly'},
  {key:'previousAccountBalance',title:'上期账户余额',type:'readonly'},
  {key:'currentAccountRecharge',title:'本期账户充值',type:'readonly'},
  {key:'currentBillExpenditure',title:'本期账单支出',type:'readonly'},
  {key:'currentAccountBalance',title:'本期账户余额',type:'readonly'},
];

const cols = [
  {key:'businessItemId',title:'费用项目'},
  {key:'price',title:'价格'},
  {key:'unitType',title:'计量单位',options:unitOptions},
  {key:'totalNumber',title:'本期总数量'},
  {key:'totalAmount',title:'总金额'},
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
