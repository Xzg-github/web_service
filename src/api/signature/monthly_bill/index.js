import express from 'express';
import {postOption, fetchJsonByNode} from '../../../common/common';
import {host,fadadaServiceName} from '../../gloablConfig';

let api = express.Router();
const service = `${host}/${fadadaServiceName}`

// 获取UI标签
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result: module.default});
});

// 获取主列表数据
api.post('/list', async (req, res) => {
  const url = `${service}/month_bill/list`;
  const {filter,...other} = req.body;
  const body = {
    ...filter,
    ...other
  };
  res.send(await fetchJsonByNode(req,url,postOption(body)))
});


//根据id获取
api.get('/getId/:id',async(req,res) => {
  const url = `${service}/month_bill/${req.params.id}`;
  res.send(await fetchJsonByNode(req,url))
});

//获取已启用的客户
api.get('/customer',async(req,res) => {
  const body = {
    companyName:req.query.filter,
    maxNumber:20
  };
  const url = `${service}/company_account/select_enabled_drop_list`;
  res.send(await fetchJsonByNode(req,url,postOption(body)))
});

//根据id获取详情
api.get('/getId',async(req,res) => {
  const url = `${service}/month_bill/${req.params.id}`;
  res.send(await fetchJsonByNode(req,url))
});

export default api;
