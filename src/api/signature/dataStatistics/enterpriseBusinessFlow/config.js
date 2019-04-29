import {pageSize, pageSizeType, description, searchConfig} from '../../../gloablConfig';

const isReversalOptions = [
  {value: 1, title: '是'},
  {value: 0, title: '否'}
];

const filters = [
  {key: 'belongMonth', title: '归属账期', type: 'text'},
  {key: 'nativeOrderNo', title: '关联订单编号', type: 'text'},
  {key: 'insertTimeFrom', title: '发生时间', type: 'date'},
  {key: 'insertTimeTo', title: '至', type: 'date'},
  {key: 'businessCode', title: '业务项目', type: 'search'},
  {key: 'isReversal', title: '是否冲销', type: 'select', options: isReversalOptions},
  {key: 'consumerTimeFrom', title: '实际扣费时间', type: 'date'},
  {key: 'consumerTimeTo', title: '至', type: 'date'},
];

const buttons = [
  {key: 'export', title: '导出', menu: [
      {key: 'exportPage', title: '页面导出'},
      {key: 'exportSearch', title: '查询导出'}
    ]}
];

const tableCols = [
  {key: 'id', title: '流水号'},
  {key: 'itemName', title: '业务项目'},
  {key: 'insertTime', title: '发生时间'},
  {key: 'signFileNo', title: '关联系统编号'},
  {key: 'executorAccountId', title: '发起人'},
  {key: 'unit', title: '单位'},
  {key: 'deductSource', title: '预扣费来源'},
  {key: 'predictUseMoney', title: '预扣费'},
  {key: 'originalPrice', title: '价格'},
  {key: 'realUseMoney', title: '实扣费'},
  {key: 'nativeOrderNo', title: '关联订单编号'},
  {key: 'consumerTime', title: '实际扣费时间'},
  {key: 'isReversal', title: '冲销', options: isReversalOptions},
  {key: 'belongMonth', title: '归属账期'},
];

const config = {
  index: {filters, buttons, tableCols, pageSizeType, pageSize, description, searchConfig}
};

export default config;



