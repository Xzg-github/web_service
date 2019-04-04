import express from 'express';
import {postOption, fetchJsonByNode} from "../../../common/common";
import {host,fadadaServiceName} from "../../gloablConfig";

let api = express.Router();
const service = `${host}/${fadadaServiceName}`;

// 获取配置信息
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result: module.default});
});

// OrderPage Table数据
api.post('/list', async (req, res) => {
  const url = `${service}/company_order/company_order_admin/list`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)))
});

//录入收款
api.post('/receipt', async (req, res) => {
  res.send({returnCode: -1, returnMsg: '操作成功'});
});

//审核
api.get('/audit/:id', async (req, res) => {
  const url = `${service}/company_order/complete/${req.params.id}`;
  res.send(await fetchJsonByNode(req, url, 'post'))
});

//获取消费记录
api.post('/detail', async (req, res) => {
  res.send({returnCode: 0, returnMsg: '操作成功', result: {
    table1: [], table2: []
    }
  })
});

//客户名称
api.post('/company', async (req, res) => {
  const url = `${service}/company_account/select_enabled_drop_list`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

export default api;
