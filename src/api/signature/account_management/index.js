import express from 'express';
import apiEnterpriseAccountManagement from './enterprise_account_management';
import apiEnterpriseCertification from './enterprise_certification';


let api = express.Router();
api.use('/enterprise_account_management', apiEnterpriseAccountManagement);
api.use('/enterprise_certification', apiEnterpriseCertification);



export default api;
