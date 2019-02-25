import express from 'express';
import {postOption, fetchJsonByNode} from '../../../../common/common';
import {host} from '../../../gloablConfig';

let api = express.Router();

// 获取UI标签
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result: module.default});
});

// 获取个人详细信息
api.get('/person/:id', async (req, res) => {
  const url = `${host}/user/detail/${req.params.id}`;
  res.send(await fetchJsonByNode(req,url));
});


//修改密码
api.post('/modify', async (req, res) => {
  const url = `${host}/user/password/modify`;
  res.send(await fetchJsonByNode(req,url,postOption(req.body)));
});


export default api;
