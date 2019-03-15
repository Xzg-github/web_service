import express from 'express';
import {postOption, fetchJsonByNode} from '../../../common/common';
import {host,fadadaServiceName} from '../../gloablConfig';

let api = express.Router();
const service = `${host}/${fadadaServiceName}`;
const service1 = `${host}`;

// 获取UI标签
api.get('/config', async (req, res) => {
    const module = await require('./config');
    res.send({returnCode: 0, result: module.default});
});

api.get('/editConfig', async (req, res) => {
  const module = await require('./editConfig');
  res.send({returnCode: 0, result: module.default});
});

//根据Id获取编辑信息
api.get('/getOne/:guid', async (req, res) => {
  const url = `${service}/sign_center/detail_by_id/${req.params.guid}`;
  res.send(await fetchJsonByNode(req, url));
});

//获取用户名
api.get('/getName/:token', async (req, res) => {
  console.log(req.params.token);
  const url = `${service1}/auth-center-provider/authc/${req.params.token}/account`;
  console.log(url);
  res.send(await fetchJsonByNode(req, url))
});

//获取列表数据
api.post('/list', async (req, res) => {
  const url = `${service}/sign_center/search_sign_file`;
  const {filter, ...other} = req.body;
  res.send(await fetchJsonByNode(req, url, postOption({...filter, ...other})));
});

//获取全部tabs列表数据
api.post('/tabslist', async (req, res) => {
  const url = `${service}/sign_center/search_sign_file`;
  const states = [
    {
      signUser:'me',
      signState:'wait'
    },{
      signUser:'other',
      signState:'wait'
    },{
      signUser:'me',
      signState:'draft'
    },{
    },
  ];

  const count = [];
  for(let state of states){
   let body = {
      itemFrom:0,
      itemTo:65536,
      ...state
    };
    let json = await fetchJsonByNode(req,url,postOption(body));
    if(json.returnCode !== 0 ){
      res.send({returnCode:-1,returnMsg:'获取数据失败'});
      return
    }
    count.push(json.result.returnTotalItems)
  }
  res.send({returnCode:0,returnMsg:'操作成功',result:count});

});


//保存
api.post('/save', async(req, res) => {
  const url = `${service}/sign_center/save_sign`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

//签署 -- 下一步
api.post('/sign', async(req, res) => {
  const url = `${service}/sign_center/sign_file`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

//发送
api.post('/send', async(req, res) => {
  const url = `${service}/sign_center/send_file`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

//删除
api.post('/del', async(req, res) => {
  const url = `${service}/sign_center/delete_sign_file`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)))
});

//从群组中添加
api.post('/groups', async(req, res) => {
  const url = `${service}/sign_group/select_by_param`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)))
});

//从联系人中添加
api.post('/name', async(req, res) => {
  const url = `${service}/company_contact/concat_by_name_or_account`;
  res.send(await fetchJsonByNode(req, url, postOption(req, body)))
});

//校验企业认证
api.post('/authentication', async(req, res) => {
  const url = `${service}/verify/company_verify`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)))
});

//校验企业是否已经认证
api.get('/authenticationList', async(req, res) => {
  const {accountId} = req.cookies;
  const url = `${service}/company_account/detail`;
  res.send(await fetchJsonByNode(req, url))
});

export default api;
