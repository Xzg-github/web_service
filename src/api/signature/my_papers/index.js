import express from 'express';
import {postOption, fetchJsonByNode} from '../../../common/common';
import {host,fadadaServiceName} from '../../gloablConfig';

let api = express.Router();
const service = `${host}/${fadadaServiceName}`;

// 获取UI标签
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result: module.default});
});

//树的改动

api.get('/tree', async (req, res) => {
  const url = `${service}/sign_file_folder/tree`;
  res.send(await fetchJsonByNode(req,url))
});

//新增组
api.post('/addGroup',async(req,res) => {
  const {accountId} = req.cookies;
  const body = {
    accountId,
    ...req.body
  };
  const url = `${service}/sign_file_folder/add`;
  res.send(await fetchJsonByNode(req,url,postOption(body)))
});

//编辑组
api.put('/editGroup',async(req,res) => {
  const url = `${service}/sign_file_folder/update`;
  res.send(await fetchJsonByNode(req,url,postOption(req.body,'put')))
});

//删除组
api.delete('/delGropp/:id', async (req, res) => {
  const url = `${service}/sign_file_folder/delete/${req.params.id}`;
  res.send(await fetchJsonByNode(req,url,postOption(req.body,'delete')))
});

//列表改动
//查询列表
api.post('/list',async(req,res) => {
  const url = `${service}/sign_file/list`;
  res.send(await fetchJsonByNode(req,url,postOption(req.body)))
});

//移动文件夹
api.post('/move',async(req,res) => {
  const url = `${service}/sign_file/move_fold`;
  res.send(await fetchJsonByNode(req,url,postOption(req.body)))
});

//下载
api.get('/downLoad/:id',async(req,res) => {
  const url = `${service}/sign_file/down_file/${req.params.id}`;
  res.send(await fetchJsonByNode(req,url))
});

// 联系人列表
api.post('/searchList', async (req, res) => {
  const body = {
    param:req.body.filter
  };
  const url = `${service}/sign_group/select_member_info`;
  res.send(await fetchJsonByNode(req,url,postOption(body)));
});


export default api;
