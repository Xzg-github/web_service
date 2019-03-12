import express from 'express';
import {postOption, fetchJsonByNode} from '../../../common/common';
import {host} from '../../gloablConfig';

let api = express.Router();
const service = `${host}/fadada-service`;

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

//获取列表数据
api.post('/list', async (req, res) => {
  const url = `${service}/sign_center/search_sign_file`;
  const {filter, ...other} = req.body;
  res.send(await fetchJsonByNode(req, url, postOption({...filter, ...other})));
});

//获取全部tabs列表数据
api.post('/tabslist', async (req, res) => {
  const url = `${service}/sign_center/search_sign_file`;
  const states = ['mySigned','hisSign','draft',false];
  let body = {
    itemFrom:0,
    itemTo:65536
  };
  const count = [];
  for(let state of states){
    if(state){
      body.signState = state;
    }else {
      delete body.signState
    }
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
api.post('/delete', async(req, res) => {
  const url = `${service}/sign_center/delete_sign_file`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)))
});

//从群组中添加
api.post('/groups', async(req, res) => {
  const url = `${service}/user/sign_groups/search`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)))
});

//校验企业认证
api.post('/authentication', async(req, res) => {
  const url = `${service}/verify/company_verify`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)))
});

//校验企业是否已经认证
api.get('/authenticationList', async(req, res) => {
  const {accountId} = req.cookies;
  const url = `${service}/company_account/detail/${accountId}`;
  res.send(await fetchJsonByNode(req, url))
});

export default api;
