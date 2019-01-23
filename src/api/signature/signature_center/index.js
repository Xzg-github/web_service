import express from 'express';
import {postOption, fetchJsonByNode} from '../../../common/common';
import {host} from '../../gloablConfig';

let api = express.Router();

// 获取UI标签
api.get('/config', async (req, res) => {
    const module = await require('./config');
    res.send({returnCode: 0, result: module.default});
});

api.get('/editConfig', async (req, res) => {
  const module = await require('./editConfig');
  res.send({returnCode: 0, result: module.default});
});

/*//获取主列表数据
api.get('/list', async (req, res) => {
  const module = await require('./data');
  res.send(module.default);
});*/

//获取列表数据
api.post('/list', async (req, res) => {
  const url = `${host}/sign_center/search_sign_file`;
  const {filter, ...other} = req.body;
  res.send(await fetchJsonByNode(req, url, postOption({...filter, ...other})));
});

//保存
api.post('/save', async(req, res) => {
  const url = `${host}/sign_center/save_sign`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

//签署
api.post('/sign', async(req, res) => {
  const url = `${host}/sign_center/sign_file`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

export default api;
