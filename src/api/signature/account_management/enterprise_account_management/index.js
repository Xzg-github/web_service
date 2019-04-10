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
api.get('/oneList', async (req, res) => {
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

//支付订单
api.post('/payOrder/:id', async (req, res) => {
  const url = `${service}/company_order/complete/${req.params.id}`;
  res.send(await fetchJsonByNode(req,url,postOption(req.body)));
});

//根据id获取价格信息
api.get('/price/:id', async (req, res) => {
  const url = `${service}/company_order/${req.params.id}`;
  res.send(await fetchJsonByNode(req,url));
});

//根据id获取账单信息
api.get('/record/:id', async (req, res) => {
  const url = `${service}/company_order/view_record/${req.params.id}`;
  res.send(await fetchJsonByNode(req,url));
});

//获取已认证的员工下拉
api.get('/dropPerson', async (req, res) => {
  const url = `${service}/user_account/drop_list_user_real_name`;
  res.send(await fetchJsonByNode(req,url));
});

//根据id获取账号
api.get('/personAccount/:id', async (req, res) => {
  const url = `${service}/user_account/view_user/${req.params.id}`;
  res.send(await fetchJsonByNode(req,url));
});

//新增权限
api.post('/addAuthl', async (req, res) => {
  const url = `${service}/company_sea_authl_info`;
  res.send(await fetchJsonByNode(req,url,postOption(req.body)));
});

api.put('/addAuthl', async (req, res) => {
  const url = `${service}/company_sea_authl_info`;
  res.send(await fetchJsonByNode(req,url,postOption(req.body,'put')));
});

//列表
api.post('/listAuthl', async (req, res) => {
  const url = `${service}/company_sea_authl_info/list`;
  res.send(await fetchJsonByNode(req,url,postOption(req.body)));
});



//权限删除
api.delete('/delAuthl', async (req, res) => {
  const url = `${service}/company_sea_authl_info`;
  res.send(await fetchJsonByNode(req,url,postOption(req.body,'delete')));
});

//权限删除
api.put('/batchAuthl/:status', async (req, res) => {
  const url = `${service}/company_sea_authl_info/batch?status=${req.params.status}`;
  res.send(await fetchJsonByNode(req,url,postOption(req.body,'put')));
});

//获取单条信息
api.get('/edit/:id', async (req, res) => {
  const url = `${service}/company_sea_authl_info/${req.params.id}`;
  res.send(await fetchJsonByNode(req,url));
});

export default api;
