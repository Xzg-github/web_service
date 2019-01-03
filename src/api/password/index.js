import express from 'express';
import {host} from '../gloablConfig';
import {fetchJsonByNode, postOption} from '../../common/common';
let api = express.Router();

const service = `${host}/auth-center-provider`;

const modifyConfig = {
  old: '请输入旧密码',
  new: '请输入新密码',
  confirm: '请确认新密码',
  title: '修改密码',
  ok: '确定'
};

api.get('/modify/config', (req, res) => {
  res.send({returnCode: 0, result: modifyConfig});
});

api.put('/modify', async (req, res) => {
  const url = `${host}/tenant_service/user/change/password`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
});

// 发送找回密码的邮件
api.put('/mail', async (req, res) => {
  const url = `${host}/auth-center-provider/account/findPasswordByEmail`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
});

// 重置密码
api.put('/reset', async (req, res) => {
  const url = `${host}/auth-center-provider/account/user/userResetByEmail`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
});

////////////////////////新的找回密码界面///////////////////////////////////////////////////////////////////
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result: module.default});
});

// 发送验证码
api.post('/sendCode', async (req, res) => {
  const url = `${service}/password/resetting/sendSecurityCode/${req.body.type}?recipient=${req.body.recipient}`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'get')));
});

// 校验验证码并设置新密码
api.post('/reset', async (req, res) => {
  const url = `${service}/password/resetting/doReset/${req.body.type}`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
});
////////////////////////新的找回密码界面///////////////////////////////////////////////////////////////////

export default api;
