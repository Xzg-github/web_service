import express from 'express';
import {postOption, fetchJsonByNode} from '../../../../common/common';
import {host} from '../../../gloablConfig';

let api = express.Router();
const service = `${host}/fadada-service`;

// 获取UI标签
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result: module.default});
});

// 获取主列表数据
api.post('/list', async (req, res) => {
  const {filter,...other} = req.body;
  const body = {
    ...filter,
    other
  };
  const url = `${service}/price_manager/list`;
  res.send(await fetchJsonByNode(req,url,postOption(body)))
});

//新增
api.post('/update', async(req,res) => {
  const url = `${service}/price_manager`;
  res.send(await fetchJsonByNode(req,url,postOption(req.body)))
});

//编辑
api.put('/update', async(req,res) => {
  const url = `${service}/price_manager`;
  res.send(await fetchJsonByNode(req,url,postOption(req.body,'put')))
});

//批量删除
api.delete('/del', async(req,res) => {
  const url = `${service}/price_manager/batch`;
  res.send(await fetchJsonByNode(req,url,postOption(req.body,'delete')))
});

//业务项目的下拉
api.post('/dropDown', async(req,res) => {
  const url = `${service}/business_items/drop_list`;
  res.send(await fetchJsonByNode(req,url,postOption(req.body)))
});

//批量失效
api.put('/disable/:statusType', async(req,res) => {
  const url = `${service}/price_manager/batch/${req.params.statusType}`;
  res.send(await fetchJsonByNode(req,url,postOption(req.body,'put')))
});

//获取单条
api.get('/one/:id', async(req,res) => {
  const url = `${service}/price_manager/${req.params.id}`;
  res.send(await fetchJsonByNode(req,url))
});



export default api;
