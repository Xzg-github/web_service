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
  const url = `${host}/user_account/detail/${req.params.id}`;
  res.send(await fetchJsonByNode(req,url));
});


//修改密码
api.post('/modify', async (req, res) => {
  const url = `${host}/user/password/modify`;
  res.send(await fetchJsonByNode(req,url,postOption(req.body)));
});

//修改天数
api.post('/updateDays', async (req, res) => {
  const url = `${host}/user_account/update_days_of_advance_notice`;
  res.send(await fetchJsonByNode(req,url,postOption(req.body)));
});

//修改邮箱通知
api.post('/email', async (req, res) => {
  const url = `${host}/user_account/update_is_notified_by_email`;
  res.send(await fetchJsonByNode(req,url,postOption(req.body)));
});

//修改短信通知
api.post('/phone', async (req, res) => {
  const url = `${host}/user_account/update_is_notified_by_phone`;
  res.send(await fetchJsonByNode(req,url,postOption(req.body)));
});


export default api;
