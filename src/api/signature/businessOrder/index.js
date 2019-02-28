import express from 'express';
import {postOption, fetchJsonByNode} from "../../../common/common";
import {host} from "../../gloablConfig";

let api = express.Router();

// 获取配置信息
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result: module.default});
});

// OrderPage Table数据
api.post('/list', async (req, res) => {
  res.send({returnCode: 0, result: {data:[
        {statusType:'waitIdentification', orderNumber: '123456'}]}
  });
});

//录入收款
api.post('/receipt', async (req, res) => {
  res.send({returnCode: -1, returnMsg: '操作成功'});
});

//审核
api.post('/audit', async (req, res) => {
  res.send({returnCode: 0, returnMsg: '操作成功'});
});


export default api;
