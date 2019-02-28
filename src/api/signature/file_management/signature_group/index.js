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
api.post('/list', async (req, res) => {
  const {filter,...other} = req.body;
  const url = `${host}/sign_group/list`;
  const body = {
    ...filter,
    other
  };
  res.send(await fetchJsonByNode(req, url,postOption(body)));
});

//新增
api.post('/', async (req, res) => {
  const url = `${host}/sign_group/add`;
  res.send(await fetchJsonByNode(req, url,postOption(req.body)));
});

//编辑
api.put('/', async (req, res) => {
  const url = `${host}/sign_group/save`;
  res.send(await fetchJsonByNode(req, url,postOption(req.body)));
});

//删除
api.post('/delete', async (req, res) => {
  const url = `${host}/sign_group/delete`;
  res.send(await fetchJsonByNode(req, url,postOption(req.body)));
});

//获取单条信息
api.get('/getId/:id', async (req, res) => {
  const url = `${host}/sign_group/selectMemberInfoById/${req.params.id}`;
  res.send(await fetchJsonByNode(req, url,));
});


export default api;
