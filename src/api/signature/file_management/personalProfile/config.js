import {pageSize, pageSizeType, description, searchConfig} from '../../../gloablConfig';

const isOptions1 = [
  {value: 0, title: '禁用'},
  {value: 1, title: '待认证'},
  {value: 2, title: '认证失败'},
  {value: 3, title: '已认证'}
];

const filters = [
  {key: 'name', title: '姓名', type: 'text'},
  {key: 'account', title: '注册账号', type: 'text'},
  {key: 'number', title: '手机号码', type: 'text'},
  {key: 'statusType', title: '状态', type: 'select', options: isOptions1},
  {key: 'email', title: '电子邮件', type: 'text'},
  {key: 'customerOrder', title: '归属企业', type: 'text'},
];

const tableCols = [
  {key: 'statusType', title: '账号状态', options: isOptions1},
  {key: 'account', title: '注册账号', link: true},
  {key: 'ame', title: '姓名'},
  {key: 'idCard', title: '身份证号码'},
  {key: 'number', title: '手机号码'},
  {key: 'email', title: '电子邮件'},
  {key: 'customerOrder', title: '归属企业名称'},
  {key: 'bankName', title: '企业编号'},
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
  businessInfo, managerInfo, businessTitle: '个人信息', managerTitle: '管理人信息', editButton
};

const tabs = [
  {key: 'index', title: '个人档案列表', close: false}
];

const config = {
  activeKey: 'index', tabs, index, editConfig
};

export default config;



