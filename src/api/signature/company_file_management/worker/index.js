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
  const url = `${host}/user_account/list`;
  const {filter, ...other} = req.body;
  res.send(await fetchJsonByNode(req, url, postOption({...filter, ...other})));
});

//启用/禁用
api.post('/status', async(req, res) => {
  const url = `${host}/user_account/update_user_account_status`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'post')))
});

export default api;
