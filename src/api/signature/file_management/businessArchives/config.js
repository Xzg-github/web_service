import {pageSize, pageSizeType, description, searchConfig} from '../../../gloablConfig';

const statusTypeOptions = [
  {value: 0, title: '已禁用'},
  {value: 1, title: '待认证'},
  {value: 2, title: '认证失败'},
  {value: 3, title: '已认证'}
];

const filters = [
  {key: 'companyName', title: '企业名称', type: 'text'},
  {key: 'account', title: '企业账号', type: 'text'},
  {key: 'companyOrder', title: '企业编号', type: 'text'},
  {key: 'companyAccountState', title: '状态', type: 'select', options: statusTypeOptions},
];

const tableCols = [
  {key: 'companyAccountState', title: '状态', options: statusTypeOptions},
  {key: 'companyOrder', title: '企业编号', link: true},
  {key: 'companyName', title: '企业名称'},
  {key: 'account', title: '企业账号'},
  {key: 'legalPersonName', title: '法人姓名'},
  {key: 'userName', title: '管理人姓名'},
  {key: 'bankAccount', title: '对公银行账号'},
  {key: 'bankAccountName', title: '对公银行名称'},
  {key: 'bankAccountBranch', title: '对公开户支行'},
  {key: 'companyContactPhone', title: '企业电话'},
  {key: 'address', title: '收件地址'}
];

const buttons = [
  {key: 'add', title: '新增客户', bsStyle: 'primary'},
  {key: 'export', title: '导出', menu: [
      {key: 'exportSearch', title: '查询导出'},
      {key: 'exportPage', title: '页面导出'}
      ]
  }
];

const index = {
  filters, buttons, tableCols, description, searchConfig, pageSizeType, pageSize
};

//企业信息表单配置企业档案
const businessInfo = [
  {key: 'customerEmail', title: '客户邮箱', type: 'text', required: true},
  {key: 'companyName', title: '企业名称', type: 'text', required: true, placeholder: '请填写营业执照上的名称'},
  {key: 'organizationCode', title: '组织代码机构证/统一社会信用代码', type: 'text', required: true, placeholder: '请输入9位组织机构证代码或18位统一社会信用代码'},
  {key: 'licenseNumber', title: '营业执照注册号/统一社会信用代码', type: 'text', required: true, placeholder: '请输入16位营业执照注册号或18位统一社会信用代码'},
  {key: 'bankAccount', title: '对公银行账号', type: 'text', required: true},
  {key: 'bankAccountName', title: '对公银行名称', type: 'text', required: true},
  {key: 'bankAccountBranch', title: '对公开户支行', type: 'text', required: true, placeholder: '请填写完整的支行名称'}
];

//管理人信息表单配置
const managerInfo = [
  {key: 'legalPersonName', title: '法人代表姓名', type: 'text', required: true, placeholder: '请填写与执照上一致的法定代表人姓名'},
  {key: 'legalPersonIdNumber', title: '法人代表身份证号', type: 'text', required: true, placeholder: '请填写与执照上一致的法定代表人身份证号码'},
  {key: 'userName', title: '账号管理人姓名', type: 'text', required: true},
  {key: 'idCard', title: '账号管理人身份证号', type: 'text', required: true}
];

const editButton = [
  {key: 'close', title: '关闭'}
];

const addButton = [
  {key: 'close', title: '关闭'},
  {key: 'save', title: '保存'},
  {key: 'commit', title: '提交'}
];

const businessInfoUpload = [
  {key: 'urlOfLicensePicture', title: '营业执照/多合一营业执照'},
  {key: 'urlOfOrganizationCode', title: '组织代码机构证/多合一营业执照'},
  {key: 'applicationForm', title: '按要求上传申请表'}
];

const managerInfoUpload = [
  {key: 'urlOfLegalPersonPicture', title: '法定代表人身份证正反面复印件'},
  {key: 'urlOfIdCard', title: '账号管理人身份证正反面复印件'}
];

const editConfig = {
  businessInfo, managerInfo, businessTitle: '企业信息', managerTitle: '管理人信息', editButton, addButton, businessInfoUpload, managerInfoUpload
};

const tabs = [
  {key: 'index', title: '档案列表', close: false}
];

const config = {
  activeKey: 'index', tabs, index, editConfig
};

export default config;



