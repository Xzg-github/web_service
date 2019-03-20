import express from 'express';
import {postOption, fetchJsonByNode} from "../../../../common/common";
import {host,fadadaServiceName} from "../../../gloablConfig";

let api = express.Router();
const service = `${host}/${fadadaServiceName}`;

// 获取配置信息
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result: module.default});
});

// OrderPage Table数据
api.post('/list', async (req, res) => {
  const url = `${service}/company_account/list`;
  const {filter, ...others} = req.body;
  res.send(await fetchJsonByNode(req, url, postOption({...filter, ...others})));
});

// EditPage 页面数据
api.get('/detail/:id', async (req, res) => {
  const url = `${service}/company_account/view_customer_info/${req.params.id}`;
  res.send(await fetchJsonByNode(req, url));
});

export default api;

