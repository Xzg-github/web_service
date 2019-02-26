import express from 'express';
import {postOption, fetchJsonByNode} from '../../../../common/common';
import {host} from '../../../gloablConfig';

let api = express.Router();

const serivce = `${host}/fadada-service-lam`;

// 获取UI标签
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result: module.default});
});


/*联系人组*/

// 树列表
api.get('/tree', async (req, res) => {
  const url = `${serivce}/company_contact_group/tree`;
  res.send(await fetchJsonByNode(req,url))
});

//新增组
api.post('/addGroup',async(req,res) => {
  const url = `${serivce}/company_contact_group/add`;
  res.send(await fetchJsonByNode(req,url,postOption(req.body)))
});

//编辑组
api.post('/editGroup',async(req,res) => {
  const url = `${serivce}/company_contact_group/add`;
  res.send(await fetchJsonByNode(req,url,postOption(req.body)))
});

// 获取主列表数据
api.post('/list', async (req, res) => {
  res.send({returnCode: 0, result: []});
});

export default api;
