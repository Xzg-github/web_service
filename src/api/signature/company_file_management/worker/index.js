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
  const url = `${service}/user_account/list`;
  const {filters, ...other} = req.body;
  res.send(await fetchJsonByNode(req, url, postOption({...filters, ...other})));
});

//启用/禁用
api.post('/status', async(req, res) => {
  const url = `${service}/user_account/update_user_account_status`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'post')))
});

//审核通过
api.post('/audit', async (req, res) => {
  const url = `${service}/user_account/company_audit`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'post')))
});

//解绑
api.post('/untied', async(req, res) => {
  const url = `${service}/user_account/relieve_bind_company_belong`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'post')))
});

export default api;
