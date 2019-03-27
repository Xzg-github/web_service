const isOptions = [
  {value: 1, title: '是'},
  {value: 0, title: '否'}
];

const isOptions1 = [
  {value: 1, title: '代表个人'},
  {value: 0, title: '代表企业'}
];

const isWay = [
  {value: 1, title: '签署文件（每人都需签署）'},
  {value: 0, title: '发起文件（仅需对方签署）'}
];

const isStrategy = [
  { value: 0, title: '无序签署'},
  { value: 1, title: '顺序签署(签署顺序为表格序号)'},
  { value: 2, title: '每个单独签'}
];

const uploadButtons = [
  { key: 'upload', title: '上传文件', bsStyle: 'primary'}
];

const controls1 = [
  { key: 'signFileSubject', title: '文件主题', type: 'text', span: 2, required: true},
  { key: 'signExpirationTime', title: '签署截止时间', type: 'date', props:{showTime: true}},
  { key: 'note', title: '备注', type: 'textArea', span: 4},
];

const controls2 = [
  { key: 'signWay', title: '签署方式', type: 'select', options: isWay, required: true},
  { key: 'signOrderStrategy', title: '签署顺序',  type: 'select', options: isStrategy, required: true},
/*  { key: 'isSignInSpecifiedLocation', title: '指定签署位置', type: 'select', options: isOptions},
  { key: 'isAddCcSide', title: '添加抄送方', type: 'select',options: isOptions}*/
];

const tableButtons = [
  { key: 'increase', title: '添加', bsStyle: 'primary'},
  { key: 'contact', title: '联系人中添加'},
  //{ key: 'group', title: '从签署群组添加'},
  {key: 'del', title: '删除', confirm:'是否确定删除'}
];

const tableCols = [
  { key: 'checked', title: '', type: 'checkbox'},
  { key: 'index', title: '序号', type: 'index'},
  { key: 'sequence', title: '签署顺序',type: 'number', required: true, hide: true},
  { key: 'signPartyName', title: '姓名/机构',type: 'text', required: true},
  { key: 'account', title: '账号（邮箱）', type: 'text'},
/*  { key: 'isAllowAddSignatories', title: '允许增加签署方', type: 'select', options: isOptions},
  { key: 'signIdentity', title: '签署身份', type: 'select', options: isOptions1}*/
];


const footerButtons1 = [
  { key: 'close', title: '关闭'},
  { key: 'save', title: '保存'},
  { key: 'next', title: '下一步', bsStyle: 'primary'},
];

const footerButtons2 = [
  { key: 'close', title: '关闭'},
  { key: 'save', title: '保存'},
  { key: 'send', title: '发送', bsStyle: 'primary'}
];

const editConfig = {
  buttons1: uploadButtons,
  controls1: controls1,
  controls2: controls2,
  buttons2:tableButtons,
  tableCols,
  buttons3: footerButtons1,
  buttons4: footerButtons2,
  contactConfig: {
    title: '从联系人中添加',
    tableCols : [
      {key: 'companyContactName', title: '姓名'},
      {key: 'companyContactAccount', title: '账号'},
    ],
    maxHeight: '400px',
    size: 'small',
  },
  groupConfig: {
    title: '从签署群组添加',
    tableCols: [
      {key: 'signGroupName', title: '签署群组名称'},
      //{key: 'concatMemberVos', title: '群组成员'}
    ],
    maxHeight: '400px',
    size: 'small',
  },
};

export default editConfig
