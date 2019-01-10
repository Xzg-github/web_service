import {pageSize, pageSizeType, description, searchConfig} from '../../gloablConfig';

const isYesOrNo = [
  {title:'是',value:1},
  {title:'否',value:0}
];

const filters = [
  {key:'a',title:'文件主题',type:"text"},
  {key:'b',title:'发起人',type:"text"},
  {key:'c',title:'发起时间',type:"date"},
  {key:'d',title:'至',type:"date"},

];

const tableCols = [
  {key:'a',title:'系统编号',link:true},
  {key:'b',title:'文件主题',link:true},
  {key:'c',title:'发起人'},
  {key:'d',title:'发起时间'},
  {key:'e',title:'签完时间'},
];

const buttons = [
  {key:'move',title:'移动文件',bsStyle:'primary'},
  {key:'share',title:'文件夹共享'},
  {key:'download',title:'下载'}
];

const treeButtons = [
  {key:'file',title:'管理文件夹'},
  {key:'share',title:'文件夹共享'},
];

const fileButtons = [
  {key:'add',title:'新增'},
  {key:'edit',title:'编辑'},
  {key:'del',title:'删除'},
];

const shareCols = [
  {key:'a',title:'姓名'},
  {key:'b',title: '所属部门'},
];

const shareButtons = [
  {key:'add',title:'添加'},
  {key:'del',title: '移除'},
];

const config = {
  index:{
    filters,
    buttons,
    tableCols,
    pageSize,
    pageSizeType,
    description,
    searchConfig,
    treeButtons
  },
  root:'全部文件',
  file:{
    buttons:fileButtons
  },
  share:{
   cols:shareCols,
   buttons:shareButtons
  },
  chooseGoodsConfig: {
    searchConfig,
    filters: [
      {key: 'filter', title: '', span: 2, type: 'text', props: {placeholder: '请输入姓名、账号、状态搜索'}}
    ],
    cols: [
      {key: 'a', title: '姓名'},
      {key: 'b', title: '账号'},
      {key: 'c', title: '状态'},
    ]
  }
};

export default config;
