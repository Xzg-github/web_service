import express from 'express';
import apiWorker from './worker';


let api = express.Router();
api.use('/worker', apiWorker);



export default api;
