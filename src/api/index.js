import express from 'express';
import apiDictionary from './dictionary';
import apiHome from './home';
import apiLogin from './login';
import apiPassword from './password';
import apiProxy from './proxy';
import apiStandard from './standard';
import permission from './permission';
import apiSignature from './signature'
import apiRegistered from './registered'
import apiFadada from './fadada'

const api = express.Router();
api.use('/dictionary', apiDictionary);
api.use('/home', apiHome);
api.use('/login', apiLogin);
api.use('/fadada', apiFadada);
api.use('/password', apiPassword);
api.use('/proxy', apiProxy);
api.use('/standard', apiStandard);
api.use('/permission', permission);
api.use('/signature', apiSignature);
api.use('/registered', apiRegistered);
api.use('*', (req, res) => {res.send({returnCode: 404, returnMsg: '接口不存在'})});
export default api;
