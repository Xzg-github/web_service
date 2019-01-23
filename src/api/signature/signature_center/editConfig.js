const isOptions = [
  {value: 1, title: '是'},
  {value: 0, title: '否'}
];

const isOptions1 = [
  {value: 1, title: '代表个人'},
  {value: 0, title: '代表企业'}
];

const isWay = [
  {value: 1, title: '签署文件'},
  {value: 0, title: '发起文件'}
];

const isStrategy = [
  { value: 0, title: '无序签署'},
  { value: 1, title: '顺序签署'},
  { value: 2, title: '每个单独签'}
];

const uploadButtons = [
  { key: 'upload', title: '上传文件', bsStyle: 'primary'}
];

const controls1 = [
  { key: 'signFileSubject', title: '文件主题', type: 'text', span: 2},
  { key: 'signFinishTime', title: '签署截止时间', type: 'date'},
  { key: 'note', title: '备注', type: 'textArea', span: 4},
];

const controls2 = [
  { key: 'signWay', title: '签署方式', type: 'select', options: isWay},
  { key: 'signOrderStrategy', title: '签署顺序',  type: 'select', options: isStrategy, required: true},
  { key: 'isSignInSpecifiedLocation', title: '指定签署位置', type: 'select', options: isOptions},
  { key: 'isAddCCSide', title: '添加抄送方', type: 'select',options: isOptions}
];

const tableButtons = [
  { key: 'increase', title: '添加', bsStyle: 'primary'},
  { key: 'contact', title: '联系人中添加'},
  { key: 'group', title: '从签署群组添加'},
  {key: 'del', title: '删除', confirm:'是否确定删除'}
];

const tableCols = [
  { key: 'checked', title: '', type: 'checkbox'},
  { key: 'index', title: '序号', type: 'index'},
  { key: 'signPartyName', title: '姓名/机构',type: 'text'},
  { key: 'signPartyEmail', title: '邮箱', type: 'text'},
  { key: 'signPartyPhoneNumber', title: '手机号码',type: 'text'},
  //{ key: 'whether', title: '允许增加签署方', type: 'select', options: isOptions},
  //{ key: 'identity', title: '签署身份', type: 'select', options: isOptions1}
];

const footerButtons = [
  { key: 'save', title: '保存'},
  { key: 'next', title: '下一步', bsStyle: 'primary'},
];

const editConfig = {
  buttons1: uploadButtons,
  controls1: controls1,
  controls2: controls2,
  buttons2:tableButtons,
  tableCols,
  buttons3: footerButtons,
  contactConfig: {
    title: '从联系人中添加',
    tableCols : [
      {key: 'mechanism', title: '姓名'},
      {key: 'accountNumber', title: '账号'},
    ],
    maxHeight: '400px',
    size: 'small',
  },
  groupConfig: {
    title: '从签署群组添加',
    tableCols: [
      {key: 'groupName', title: '签署群组名称'},
      {key: 'member', title: '群组成员'}
    ],
    maxHeight: '400px',
    size: 'small',
  },
};

export default editConfig
