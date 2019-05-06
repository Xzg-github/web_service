import express from 'express';
import {postOption, fetchJsonByNode} from '../../../common/common';
import {host,fadadaServiceName} from '../../gloablConfig';

let api = express.Router();

const service = `${host}/${fadadaServiceName}`;

// 获取UI标签
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result:module.default});
});

// 获取主列表数据
api.post('/list', async (req, res) => {
  const url = `${service}/company_account_credit/list`;
  const {filter, ...others} = req.body;
  res.send(await fetchJsonByNode(req, url, postOption({...filter, ...others})));
});

//企业名称
api.post('/companyName', async (req, res) => {
  const url = `${service}/company_account/drop_list`;
  const {filter, ...others} = req.body;
  res.send(await fetchJsonByNode(req, url, postOption({...filter, ...others})));
});

//信用额度设置
api.post('/credits', async (req, res) => {
  const url = `${service}/company_account_credit/add_credit`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

//查看订购记录
api.post('/viewQuota', async (req, res) => {
  const url = `${service}/company_account_credit/view_record`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

//价格明细列表
api.get('/rule', async (req, res) => {
  const url = `${service}/price_manager_detail/select_detail_with_rule`;
  res.send(await fetchJsonByNode(req,url));
});

//企业套餐新增
api.post('/order', async (req, res) => {
  const url = `${service}/company_order`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

//支付订单接口
api.post('/payOrder', async (req, res) => {
  const url = `${service}/company_order/complete`;
  res.send(await fetchJsonByNode(req,url,postOption(req.body)));
});

export default api;
