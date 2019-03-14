import express from 'express';
import {postOption, fetchJsonByNode} from '../../../../common/common';
import {host,fadadaServiceName} from '../../../gloablConfig';

let api = express.Router();

const service = `${host}/${fadadaServiceName}`;

// 获取UI标签
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result: module.default});
});

// 获取主列表数据
api.get('/oneList/:id', async (req, res) => {
  const url = `${service}/company_account/detail`;
  res.send(await fetchJsonByNode(req,url));
});

//修改天数
api.post('/updateDays', async (req, res) => {
  const url = `${service}/company_account/update_days_of_advance_notice`;
  res.send(await fetchJsonByNode(req,url,postOption(req.body)));
});

//订单管理
//获取价格明细
api.get('/rule', async (req, res) => {
  const url = `${service}/price_manager_detail/select_detail_with_rule`;
  res.send(await fetchJsonByNode(req,url));
});

//获取列表
api.post('/list', async (req, res) => {
  const {filter,...other} = req.body;
  const body = {
    ...filter,
    ...other
  };
  const url = `${service}/company_order/list`;
  res.send(await fetchJsonByNode(req,url,postOption(body)));
});

//新增企业订单
api.post('/addOrder', async (req, res) => {
  const url = `${service}/company_order`;
  const body = {
    ...req.body,
  };
  res.send(await fetchJsonByNode(req,url,postOption(body)));
});

//根据id获取价格信息
api.get('/price/:id', async (req, res) => {
  const url = `${service}/company_order/${req.params.id}`;
  res.send(await fetchJsonByNode(req,url));
});

export default api;
