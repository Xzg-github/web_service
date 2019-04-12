import {pageSize, pageSizeType, description, searchConfig} from '../../gloablConfig';

const user = '/api/signature/my_papers/userDrop';

const isYesOrNo = [
  {title:'是',value:1},
  {title:'否',value:0}
];

const filters = [
  {key:'signFileSubject',title:'文件主题',type:"text"},
  {key:'insertUser',title:'发起人',type:"search",searchUrl: user},
  {key:'signStartTimeFrom',title:'发起时间',type:"date",props:{showTime:true}},
  {key:'signStartTimeTo',title:'至',type:"date",props:{showTime:true}},
  {key:'isAddCcSide',title:'是否抄送',type:"select",options:isYesOrNo},
  {key:'signFileOrder',title:'系统编号',type:'text'}
];

const tableCols = [
  {key:'signFileOrder',title:'系统编号'},
  {key:'signFileSubject',title:'文件主题'},
  {key:'insertUser',title:'发起人'},
  {key:'signStartTime',title:'发起时间'},
  {key:'isAddCcSide',title:'是否抄送',options:isYesOrNo},
];

const buttons = [
  {key:'move',title:'移动文件',bsStyle:'primary'},
  {key:'download',title:'下载'}
];

const treeButtons = [
  {key:'file',title:'管理文件夹'},
];

const fileButtons = [
  {key:'add',title:'新增'},
  {key:'edit',title:'编辑'},
  {key:'del',title:'删除'},
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
  }
};

export default config;
