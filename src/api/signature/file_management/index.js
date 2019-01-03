import express from 'express';
import apiContacts from './contacts';
import apiEnterpriseStaff from './enterprise_staff';
import apiSignatureGroup from './signature_group';
import apiTemplateManagement from './template_management';

let api = express.Router();
api.use('/contacts', apiContacts);
api.use('/enterprise_staff', apiEnterpriseStaff);
api.use('/signature_group', apiSignatureGroup);
api.use('/template_management', apiTemplateManagement);



export default api;
