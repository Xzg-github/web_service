import {pageSize, pageSizeType, description, searchConfig} from '../../../gloablConfig';


const buttons = [
  {key:'add',title:'新增',bsStyle:'primary'},
  {key:'edit',title:'编辑'},
  {key:'del',title:'删除'},
];

const tableCols = [
  {key:'a',title:'群组名称'},
  {key:'b',title:'组员人数'},
  {key:'c',title:'组员'},
  {key:'d',title:'备注'},
  {key:'e',title:'操作人'},
  {key:'f',title:'操作时间'},
];

const controls = [
  {key:'a',title:'群组名称',type:'text',required:true},
  {key:'b',title:'备注',type:'text'},
];

const cols = [
  {key: 'checked', title: '', type: 'checkbox'},
  {key: 'index', title: '序号', type: 'index'},
  {key:'a',title:'姓名'},
  {key:'b',title:'账号'},
  {key:'c',title:'所属分组'},
  {key:'d',title:'签署身份',type:'select'},
];

const tableButtons = [
  {key:'add',title:'添加'},
  {key:'del',title:'删除'},
  {key:'upward',title:'上移'},
  {key:'down',title:'下移'},
];

const chooseGoodsConfig =  {
  searchConfig,
    title:'添加组员',
    filters: [
    {key: 'filter', title: '', span: 2, type: 'text', props: {placeholder: '请输入姓名、账号、状态搜索'}}
  ],
    cols: [
    {key: 'a', title: '姓名'},
    {key: 'b', title: '账号'},
    {key: 'c', title: '群组'},
  ]
};

const config = {
  index:{
    buttons,
    tableCols,
    pageSize,
    pageSizeType,
    description,
    searchConfig
  },
  edit:{
    controls,
    buttons:[{key:'close',title:'关闭'}],
    cols,
    tableButtons,
    chooseGoodsConfig
  }
};

export default config;
