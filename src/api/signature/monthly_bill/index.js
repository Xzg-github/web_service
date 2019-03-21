import express from 'express';
import {postOption, fetchJsonByNode} from '../../../common/common';
import {host,fadadaServiceName} from '../../gloablConfig';

let api = express.Router();
const service = `${host}/${fadadaServiceName}`

// 获取UI标签
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result: module.default});
});

// 获取主列表数据
api.post('/list', async (req, res) => {
  const url = `${service}/month_bill/list`;
  const {filter,...other} = req.body;
  const body = {
    ...filter,
    ...other
  };
  res.send(await fetchJsonByNode(req,url,postOption(body)))
});


//根据id获取
api.get('/getId/:id',async(req,res) => {
  const url = `${service}/month_bill/${req.params.id}`;
  res.send(await fetchJsonByNode(req,url))
});

export default api;
