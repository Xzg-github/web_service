import express from 'express';
import {postOption, fetchJsonByNode} from '../../common/common';
import {host} from '../gloablConfig';

let api = express.Router();

// 获取UI标签
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result: module.default});
});

export default api;
