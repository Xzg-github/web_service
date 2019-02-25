import express from 'express';
import {postOption, fetchJsonByNode} from "../../../../common/common";
import {host} from "../../../gloablConfig";

let api = express.Router();

// 获取配置信息
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result: module.default});
});

// OrderPage Table数据
api.post('/list', async (req, res) => {
  res.send({returnCode: 0, result: {data:[
    {statusType:'waitIdentification', customerOrder: '123456'}]}
  });
});

// EditPage 页面数据
api.post('/detail', async (req, res) => {
  res.send({returnCode: 0, result: {data:[{statusType:'123456',customerOrder: '123456'}]}});
})

export default api;

