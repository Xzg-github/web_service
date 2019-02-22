import {pageSize, pageSizeType, description, searchConfig} from '../../../gloablConfig';

const statusTypeOptions = [
  {value: 'waitIdentification', title: '待认证'},
  {value: 'auditting', title: '审核中'},
  {value: 'finishIdentification', title: '已认证'},
];

const filters = [
  {key: 'businessName', title: '企业名称', type: 'text'},
  {key: 'businessAccount', title: '企业账号', type: 'text'},
  {key: 'customerOrder', title: '客户编号', type: 'text'},
  {key: 'statusType', title: '状态', type: 'select', options: statusTypeOptions},
];

const tableCols = [
  {key: 'statusType', title: '状态', options: statusTypeOptions},
  {key: 'customerOrder', title: '客户编号', link: true},
  {key: 'businessName', title: '企业名称'},
  {key: 'businessAccount', title: '企业账号'},
  {key: 'corporationName', title: '法人姓名'},
  {key: 'ManagerName', title: '管理人姓名'},
  {key: 'bankAccount', title: '对公银行账号'},
  {key: 'bankName', title: '对公银行名称'},
  {key: 'branchBankName', title: '对公开户支行'},
  {key: 'businessPhone', title: '企业电话'},
  {key: 'deliveryAddress', title: '收件地址'}
];

const buttons = [
  {key: 'export', title: '导出', menu: [
      {key: 'exportSearch', title: '查询导出'},
      {key: 'exportPage', title: '页面导出'}
      ]
  }
];

const index = {
  filters, buttons, tableCols, description, searchConfig, pageSizeType, pageSize
};

//企业信息表单配置
const businessInfo = [
  {key: 'customerEmail', title: '客户邮箱', type: 'readonly', required: true},
  {key: 'bankAccount', title: '对公银行账号', type: 'readonly', required: true},
  {key: 'businessName', title: '企业名称', type: 'readonly', required: true},
  {key: 'bankName', title: '对公银行名称', type: 'readonly', required: true},
  {key: 'BLRN', title: '营业执照注册号/统一社会信用代码', type: 'readonly', required: true},
  {key: 'branchBankName', title: '对公开户支行', type: 'readonly', required: true},
  {key: 'OCC', title: '组织代码机构证/统一社会信用代码', type: 'readonly', required: true}
];

//管理人信息表单配置
const managerInfo = [
  {key: 'corporateResName', title: '法人代表姓名', type: 'readonly', required: true},
  {key: 'accountManagerName', title: '账号管理人姓名', type: 'readonly', required: true},
  {key: 'corporateResId', title: '法人代表身份证号', type: 'readonly', required: true},
  {key: 'accountManagerId', title: '账号管理人身份证号', type: 'readonly', required: true},
];

const editButton = [
  {key: 'close', title: '关闭'}
];

const editConfig = {
  businessInfo, managerInfo, businessTitle: '企业信息', managerTitle: '管理人信息', editButton
};

const tabs = [
  {key: 'index', title: '企业档案列表', close: false}
];

const config = {
  activeKey: 'index', tabs, index, editConfig
};

export default config;



