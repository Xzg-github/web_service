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

//two
//获取页面信息
api.get('/sign', async (req, res) => {
  const {accountId} = req.cookies;
  const url = `${host}/sign_seal/list_sign_seal/${accountId}`;
  res.send(await fetchJsonByNode(req,url));
});

//新增
api.post('/addSign', async (req, res) => {
  const url = `${host}/sign_seal/edit_sign_seal_name`;
  res.send(await fetchJsonByNode(req,url,postOption(req.body)));
});

//设置默认签证
api.get('/default/:id', async (req, res) => {
  const url = `${host}/sign_seal/edit_is_defalut_seal/${req.params.id}/1`;
  res.send(await fetchJsonByNode(req,url));
});

//删除
api.delete('/delSign/:id', async (req, res) => {
  const url = `${host}/sign_seal/delete_sign_seal/${req.params.id}`;
  res.send(await fetchJsonByNode(req,url,'delete'));
});


export default api;
