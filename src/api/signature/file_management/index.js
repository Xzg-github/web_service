import express from 'express';
import apiContacts from './contacts';
import apiEnterpriseStaff from './enterprise_staff';
import apiSignatureGroup from './signature_group';
import apiTemplateManagement from './template_management';
import apiBusinessArchives from './businessArchives';
import apiPersonalProfile from './personalProfile';
import apiBusinessProject from './businessProject'
import apiPriceManagement from './price_management';

let api = express.Router();
api.use('/contacts', apiContacts);
api.use('/enterprise_staff', apiEnterpriseStaff);
api.use('/signature_group', apiSignatureGroup);
api.use('/template_management', apiTemplateManagement);
api.use('/businessArchives', apiBusinessArchives);
api.use('/personalProfile', apiPersonalProfile);
api.use('/businessProject', apiBusinessProject);
api.use('/price_management', apiPriceManagement);



export default api;
