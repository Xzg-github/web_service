import express from 'express';
import {fetchJson, fetchJsonByNode, postOption} from '../../common/common';
import {host, privilege} from '../gloablConfig';
let api = express.Router();
const service = `${host}/fadada-service-lam`;

api.post('/', async (req, res) => {
  const url = `${host}/user/webank_face_verify`;
  res.send(await fetchJsonByNode(req, url,postOption(req.body)));
});


api.get('/user/:id', async (req, res) => {
  const url = `${host}/user/detail/${req.params.id}`;
  res.send(await fetchJsonByNode(req, url));
});

export default api;
