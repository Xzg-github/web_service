import express from 'express';
import {postOption, fetchJsonByNode} from '../../../common/common';
import {host} from '../../gloablConfig';

let api = express.Router();

// 获取UI标签
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result: module.default});
});

// 树列表
api.get('/tree', async (req, res) => {
  const module = await require('./data');
  res.send({returnCode: 0, result: module.default});
});

// 获取主列表数据
api.post('/list', async (req, res) => {
  res.send({returnCode: 0, result: []});
});

// 联系人列表
api.post('/searchList', async (req, res) => {
  const url = `${host}/user/detailByPhoneOrEmailOrName/${req.body.filter}`;
  res.send(await fetchJsonByNode(req,url));
});


export default api;
