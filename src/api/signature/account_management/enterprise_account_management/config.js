import {pageSize, pageSizeType, description, searchConfig} from '../../../gloablConfig';


const oneControls = [

  {key:'dgyhzh',title:'对公银行账号',type:'text',required:true, btn:{title:"获取验证码",key:'code'}},

  {key:'dgyhmc',title:'对公银行名称',type:'text',required:true},

  {key:'dgyykhzh',title:'对公开户支行',type:'text',required:true,props:{
    placeholder:'请填写完整的支行名称'
  }},
];


const LABELS = [
  {key: 'qymc', title: '账号头像',type:'avatar'},
  {key: 'yyzzzch', title: '企业账号',type:'button',btn:'查看证书'},
  {key: 'zzjgdm', title: '登录密码',type:'edit'},
  {key: 'dgyhzh', title: '企业名称',type:'button',btn:'企业信息变更'},
  {key: 'dgyhmc', title: '法人姓名'},
  {key: 'dgyykhzh', title: '身份账号'},
  {key: 'frxm', title: '手机号码',type:'edit'},
  {key: 'frsfzh', title: '收件地址',type:'edit'},
  {key: 'zhglrxm', title: '企业电话',type:'edit'},
];



const config = {
  one:{
    controls:oneControls,
    LABELS,
    checkItems:[
      {key: 'frsfzh', title: '邮件通知'},
      {key: 'zhglrxm', title: '短信通知'},
    ]
  },
  tabs:[
    {key: 'one', title:'账号设置', close: false},
    {key: 'two', title:'签章管理', close: false},
    {key: 'three',title:'授权管理', close: false},
    {key: 'four', title:'订单管理', close: false},
  ]
};

export default config;
