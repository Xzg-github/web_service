import express from 'express';
import {fetchJson, fetchJsonByNode, postOption} from '../../common/common';
import {host, privilege,fadadaServiceName} from '../gloablConfig';
let api = express.Router();
const service = `${host}/${fadadaServiceName}`;

api.post('/', async (req, res) => {
  const url = `${service}/user/webank_face_verify`;
  res.send(await fetchJsonByNode(req, url,postOption(req.body)));
});


api.get('/user', async (req, res) => {
  const url = `${service}/user_account/detail`;
  res.send(await fetchJsonByNode(req, url));
});

export default api;
