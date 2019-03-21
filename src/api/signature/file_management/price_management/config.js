import {pageSize, pageSizeType, description, searchConfig} from '../../../gloablConfig';

const dicOptions = [
  {value:'status_draft',title:'草稿'},
  {value:'status_effective_completed',title:'已生效'},
  {value:'wait_status_effective_completed',title:'待生效'},
  {value:'status_disabled',title:'已失效'}
];

const yesOrNoOptions = [
  {value:0,title:'否'},
  {value:1,title:'是'},
];

const typeOptions = [
  {value:'platformStandardQuotation',title:'平台标准报价'},
  {value:'quoteByCustomer',title:'按客户报价'},
];

const unitOptions = [
  {value:'second',title:'次'},
  {value:'strip',title:'条'},
];

const taxOptions = [
  {value:'taxIncluded',title:'含税'},
  {value:'taxFree',title:'不含税'},
  {value:'noTaxation',title:'不计税'},
];

const chargeWayOptions = [
  {value:'fixedPrice',title:'固定价格'},
  {value:'ladderPrice',title:'阶梯价格'},
];

const ruleOptions = [
  {value:0,title:'订购金额'},
  {value:1,title:'文件份数'},
];

const filters = [
  {key:'companyId',title:'企业名称',type:'search'},
  {key:'priceType',title:'报价类型',type:'select',options:typeOptions},
  {key:'startTime',title:'生效开始日期',type:'date'},
  {key:'endTime',title:'生效终止日期',type:'date'},
  {key:'statusType',title:'状态',type:'select',options:dicOptions},
  {key:'insertTimeFrom',title:'创建日期',type:'date'},
  {key:'insertTimeTo',title:'至',type:'date'},
];

const buttons = [
  {key:'add',title:'新增',bsStyle:'primary'},
  {key:'edit',title:'编辑'},
  {key:'del',title:'删除'},
  {key:'disable',title:'失效'}
];

const tableCols = [
  {key:'statusType',title:'状态',options:dicOptions},
  {key:'priceCode',title:'报价编号'},
  {key:'priceType',title:'报价类型',options:typeOptions},
  {key:'companyId',title:'企业名称'},
  {key:'startTime',title:'生效开始日期'},
  {key:'endTime',title:'生效终止日期'},
  {key:'taxType',title:'计税方式',options:taxOptions},
  {key:'taxRate',title:'税率(%)'},
  {key:'insertUser',title:'创建人'},
  {key:'insertTime',title:'创建时间'},
  {key:'updateUser',title:'更新人'},
  {key:'updateTime',title:'更新时间'},

];

const controls = [
  {key:'priceCode',title:'报价编号',type:'readonly'},
  {key:'priceType',title:'报价类型',type:'select',options:typeOptions,required:true},
  {key:'isOpenOrder',title:'开放订购',type:'select',options:yesOrNoOptions,required:true},
  //{key:'customerId',title:'客户名称',type:'select',options:customer,required:true},
  {key:'startTime',title:'生效开始日期',type:'date',required:true},
  {key:'endTime',title:'生效终止日期',type:'date',required:true},
  {key:'taxType',title:'计税方式',type:'select',options:taxOptions,required:true},
  {key:'taxRate',title:'税率(%)',type:'number'},
  {key:'description',title:'备注',type:'textArea',span:2},
];

const cols = [
  {key: 'checked', title: '', type: 'checkbox'},
  {key:'index',title:'序号',type:'index'},
  {key:'businessItemId',title:'业务项目',type:'search',required:true},
  {key:'chargeWay',title:'计费方式',type:'select',options:chargeWayOptions,required:true},
  {key:'ruleName',title:'规则名称 ',type:'readonly'},
  {key:'unitType',title:'单位',type:'select',options:unitOptions,required:true},
  {key:'price',title:'价格(元)',type:'number',props: {real: true, precision: 2},required:true},
  {key:'description',title:'备注 ',type:'text'},
];

const colsButtons = [
  {key:'add' , title: '新增'},
  {key:'del' , title: '删除'},
  {key:'set' , title: '设置阶梯'},
];


const diaLogControls = [
  {key:'ruleBasicParameter',title:'规则基准参数',type:'select',options:ruleOptions,required:true},
  {key:'isPurchase',title:'是否选择订购',type:'select',options:yesOrNoOptions,required:true},
  {key:'startPrice',title:'区间下限(>=)',type:'number',props:{zero:true}},
  {key:'endPrice',title:'区间上限(<)',type:'number',props:{zero:true}},
  {key:'ruleName',title:'阶梯区间名称',type:'text',span:2,required:true},
  {key:'ruleDescribe',title:'价格区间规则',type:'readonly',span:2},
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
    diaLog:{
      controls:diaLogControls
    },
    colsButtons,
    buttons:[
      {key:'close',title:'关闭'},
      {key:'save',title:'保存'},
      {key:'submit',title:'提交',bsStyle:'primary'},
      ],
    cols
  }
};

export default config;
