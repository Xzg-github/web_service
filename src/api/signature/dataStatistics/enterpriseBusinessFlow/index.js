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

//获取tableItems
api.post('/list', async (req, res) => {
  const url = `${service}/data_statics/order_detail_serial`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

//业务项目
api.post('/itemName', async (req, res) => {
  const url = `${service}/business_items/drop_list`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

export default api;
