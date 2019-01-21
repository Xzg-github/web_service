import {pageSize, pageSizeType, description, searchConfig} from '../../../gloablConfig';


const controlsLeft = [
  {key:'qymc',title:'企业名称',type:'text',required:true,props:{
    placeholder:'请填写营业执照上的名称',
  }, btn:{title:"获取企业信息",key:'obtain'}},

  {key:'yyzzzch',title:'营业执照注册号/统一社会信用代码',type:'text',required:true,props:{
    placeholder:'请输入15位营业执照注册号或18位统一社会信用代码'
  }},

  {key:'zzjgdm',title:'组织代码机构证/统一社会信用代码',type:'text',required:true,props:{
    placeholder:'请输入9位组织机构证代码或18位统一社会信用代码'
  }},

];

const controlsRight = [

  {key:'dgyhzh',title:'对公银行账号',type:'text',required:true},

  {key:'dgyhmc',title:'对公银行名称',type:'text',required:true},

  {key:'dgyykhzh',title:'对公开户支行',type:'text',required:true,props:{
    placeholder:'请填写完整的支行名称'
  }},
];

const options = [
  {value:'0',title:'法定代表'},
  {value:'1',title:'非法定代表'},
];

const twoControlsLeft = [
  {key:'aa',title:'选择账号管理人身份',type:'select',required:true,options},

  {key:'frxm',title:'法定代表人姓名',type:'text',required:true,props:{
    placeholder:'请填写与执照上一致的法定代表人姓名'
  }},

  {key:'frsfzh',title:'法定代表人身份证号',type:'text',required:true,props:{
    placeholder:'请填写与执照上一致的法定代表人身份证号码'
  }},

];

const twoControlsRight = [

  {key:'bb',title:'法定代表人手机号',type:'text',required:true},

  {key:'dd',title:'短信验证码',type:'text',required:true, btn:{title:"获取验证码",key:'code'}},

];




const config = {
  one:{
    controlsLeft,
    controlsRight,
    buttons :[
      {key:'nextStep',title:'下一步',bsStyle:'primary'}
    ],
    srcObj:{},
    uploadBox:[
      {key:'pic1',title:'营业执照/多合一营业执照'},
      {key:'pic2',title:'组织代码机构证/多合一营业执照'},
    ]
  },
  two:{
    controlsLeft:twoControlsLeft,
    controlsRight:twoControlsRight,
    uploadBox:[
      {key:'pic3',title:'法定代表人手持身份证照'},
      {key:'pic4',title:'按要求上传申请表'},
    ],
    buttons :[
      {key:'previousStep',title:'上一步'},
      {key:'nextStep',title:'下一步',bsStyle:'primary'}
    ],
  }
};

export default config;
