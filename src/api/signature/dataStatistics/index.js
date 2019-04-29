import express from 'express';
import enterpriseBusinessFlow from './enterpriseBusinessFlow';
import platformBusinessFlow from './platformBusinessFlow';

let api = express.Router();
api.use('/enterpriseBusinessFlow', enterpriseBusinessFlow);
api.use('/platformBusinessFlow', platformBusinessFlow);

export default api;
