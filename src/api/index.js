import express from 'express';
import apiDictionary from './dictionary';
import apiHome from './home';
import apiLogin from './login';
import apiPassword from './password';
import apiProxy from './proxy';
import apiStandard from './standard';
import permission from './permission';

const api = express.Router();
api.use('/dictionary', apiDictionary);
api.use('/home', apiHome);
api.use('/login', apiLogin);
api.use('/password', apiPassword);
api.use('/proxy', apiProxy);
api.use('/standard', apiStandard);
api.use('/permission', permission);
api.use('*', (req, res) => {res.send({returnCode: 404, returnMsg: '接口不存在'})});
export default api;
