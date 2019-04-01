import express from 'express';
import {postOption, fetchJsonByNode} from '../../../common/common';
import {host,fadadaServiceName} from '../../gloablConfig';

let api = express.Router();

const service = `${host}/${fadadaServiceName}`;

// 获取UI标签
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result:module.default});
});

// 获取主列表数据
api.post('/list', async (req, res) => {
  const url = `${service}/company_account_credit/list`;
  const {filter, ...others} = req.body;
  res.send(await fetchJsonByNode(req, url, postOption({...filter, ...others})));
});

//企业名称
api.post('/companyName', async (req, res) => {
  const url = `${service}/company_account/drop_list`;
  const {filter, ...others} = req.body;
  res.send(await fetchJsonByNode(req, url, postOption({...filter, ...others})));
})

//信用额度设置
api.post('/credits', async (req, res) => {
  const url = `${service}/company_account_credit/add_credit`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

//查看订购记录
api.post('/viewQuota', async (req, res) => {
  const url = `${service}/company_account_credit/view_record`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

export default api;
