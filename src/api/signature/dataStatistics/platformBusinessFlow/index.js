import express from 'express';
import {postOption, fetchJsonByNode} from '../../../../common/common';
import {host} from '../../../gloablConfig';

let api = express.Router();
const service= `${host}/fadada-service`;

//获取UI
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result: module.default});
});

//归属企业
api.post('/business', async (req, res) => {
  const url = `${service}/company_account/drop_list_valuetitle_accountId_companyName`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

export default api;
