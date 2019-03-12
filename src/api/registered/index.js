import express from 'express';
import {postOption, fetchJsonByNode} from '../../common/common';
import {host} from '../gloablConfig';

let api = express.Router();

const service = `${host}/fadada-service`;

// 获取UI标签
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result: module.default});
});

//注册
api.post('/personal', async (req, res) => {
  const url = `${service}/register/register_personal_account`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'post')));
});

//企业注册
api.post('/company', async (req, res) => {
  const url = `${service}/register/register_company_account`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'post')))
});

export default api;
