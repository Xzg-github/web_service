import express from 'express';
import {postOption, fetchJsonByNode} from '../../../common/common';
import {host,fadadaServiceName} from '../../gloablConfig';

let api = express.Router();
const service = `${host}/${fadadaServiceName}`;

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
  const body = {
    param:req.body.filter
  };
  const url = `${service}/company_contact/concat_by_name_or_account`;
  res.send(await fetchJsonByNode(req,url,postOption(body)));
});


export default api;
