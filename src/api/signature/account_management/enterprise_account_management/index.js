import express from 'express';
import {postOption, fetchJsonByNode} from '../../../../common/common';
import {host} from '../../../gloablConfig';

let api = express.Router();

// 获取UI标签
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result: module.default});
});

// 获取主列表数据
api.get('/oneList/:id', async (req, res) => {
  const url = `${host}/company_account/detail/${req.params.id}`;
  res.send(await fetchJsonByNode(req,url));
});

//修改天数
api.post('/updateDays', async (req, res) => {
  const url = `${host}/company_account/update_days_of_advance_notice`;
  res.send(await fetchJsonByNode(req,url,postOption(req.body)));
});


export default api;
