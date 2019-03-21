import express from 'express';
import {postOption, fetchJsonByNode} from "../../../../common/common";
import {fadadaServiceName, host} from "../../../gloablConfig";

let api = express.Router();
const service = `${host}/${fadadaServiceName}`;

// 获取配置信息
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result: module.default});
});

// OrderPage Table数据
api.post('/list', async (req, res) => {
  const url = `${service}/user_account/list/users`;
  const {filter, ...others} = req.body;
  res.send(await fetchJsonByNode(req, url, postOption({...filter, ...others})));
});

// EditPage 页面数据
api.post('/detail', async (req, res) => {
  res.send({returnCode: 0, result: {data:[{statusType:'123456',account: '123456'}]}});
});

export default api;

