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
api.post('/list', async (req, res) => {
  const url = `${service}/business_items/list`;
  const {filter, ...other} = req.body;
  res.send(await fetchJsonByNode(req, url, postOption({...filter, ...other})));
});

//新增/编辑
api.post('/add', async(req, res) => {
  const url = `${service}/business_items`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)))
});

//删除
api.delete('/del',async(req, res) => {
  const url = `${service}/business_items/batch`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'delete')))
});


export default api;
