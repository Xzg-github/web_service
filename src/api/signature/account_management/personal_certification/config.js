import {pageSize, pageSizeType, description, searchConfig} from '../../../gloablConfig';

const filters = [
  {key: 'excelReportName', type: 'text',title: 'EXCEL报表'},
  {key: 'excelReportGroup', type: 'select',title: '报表组'},
];

const tableCols = [
  {key: 'excelReportName', title: 'EXCEL报表'},
  {key: 'excelReportGroup', title: '报表组'},
];



const config = {
  tabs:[
    {key: 'one', title:'个人认证', close: false},
  ],
  one:{},
  two:{},
  three:{
    filters,
    tableCols,
    searchConfig,
    buttons:[
      {key:'add',title:'新增',bsStyle:'primary'},
      {key:'edit',title:'编辑'},
      {key:'del',title:'删除'},
      {key:'disable',title:'禁用'},
    ],
  }
};

export default config;
