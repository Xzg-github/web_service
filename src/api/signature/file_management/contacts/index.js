import express from 'express';
import {postOption, fetchJsonByNode} from '../../../../common/common';
import {host} from '../../../gloablConfig';

let api = express.Router();


// 获取UI标签
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result: module.default});
});


/*联系人组*/

// 树列表
api.get('/tree', async (req, res) => {
  const url = `${host}/company_contact_group/tree`;
  res.send(await fetchJsonByNode(req,url))
});

//新增组
api.post('/addGroup',async(req,res) => {
  const url = `${host}/company_contact_group/add`;
  res.send(await fetchJsonByNode(req,url,postOption(req.body)))
});

//编辑组
api.put('/editGroup',async(req,res) => {
  const url = `${host}/company_contact_group/update`;
  res.send(await fetchJsonByNode(req,url,postOption(req.body,'put')))
});

//删除组
api.delete('/delGropp/:id', async (req, res) => {
  const url = `${host}/company_contact_group/delete/${req.params.id}`;
  res.send(await fetchJsonByNode(req,url,postOption(req.body,'delete')))
});


/*联系人列表*/

// 获取主列表数据
api.post('/list', async (req, res) => {
  const url = `${host}/company_contact/list`;
  res.send(await fetchJsonByNode(req,url,postOption(req.body)))
});

//新增员工
api.post('/addPerson', async (req, res) => {
  const url = `${host}/company_contact/add`;
  res.send(await fetchJsonByNode(req,url,postOption(req.body)))
});

//编辑员工
api.put('/addPerson', async (req, res) => {
  const url = `${host}/company_contact/update`;
  res.send(await fetchJsonByNode(req,url,postOption(req.body,'put')))
});

//删除员工
api.delete('/delPerson/:id', async (req, res) => {
  const url = `${host}/company_contact/delete/${req.params.id}`;
  res.send(await fetchJsonByNode(req,url,postOption(req.body,'delete')))
});

//分组群组下拉
api.get('/dropGroup',async(req,res) => {
  const url = `${host}/company_contact_group/drop_list`;
  res.send(await fetchJsonByNode(req,url))
});


export default api;
