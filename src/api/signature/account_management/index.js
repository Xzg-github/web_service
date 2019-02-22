import express from 'express';
import apiEnterpriseAccountManagement from './enterprise_account_management';
import apiEnterpriseCertification from './enterprise_certification';
import apiPersonal_certification from './personal_certification';
import apiPersonal_account_management from './personal_account_management';


let api = express.Router();
api.use('/enterprise_account_management', apiEnterpriseAccountManagement);
api.use('/enterprise_certification', apiEnterpriseCertification);
api.use('/personal_certification', apiPersonal_certification);
api.use('/personal_account_management', apiPersonal_account_management);


export default api;
