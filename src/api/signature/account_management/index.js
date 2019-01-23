import express from 'express';
import apiEnterpriseAccountManagement from './enterprise_account_management';
import apiEnterpriseCertification from './enterprise_certification';
import apiPersonal_certification from './personal_certification';


let api = express.Router();
api.use('/enterprise_account_management', apiEnterpriseAccountManagement);
api.use('/enterprise_certification', apiEnterpriseCertification);
api.use('/personal_certification', apiPersonal_certification);


export default api;
