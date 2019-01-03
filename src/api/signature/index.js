import express from 'express';
import apiSignatureCenter from './signature_center'
import apiMyPapers from './my_papers'
import apiDataStatistics from './data_statistics'
import apiMonthlyBill from './monthly_bill'
import apiEnterpriseDocuments from './enterprise_documents'
import apiFileManagement from './file_management'
import apiAccountManagement from './file_management'


let api = express.Router();
api.use('/signature_center', apiSignatureCenter);
api.use('/my_papers', apiMyPapers);
api.use('/data_statistics', apiDataStatistics);
api.use('/monthly_bill', apiMonthlyBill);
api.use('/enterprise_documents', apiEnterpriseDocuments);
api.use('/file_management', apiFileManagement);
api.use('/file_management', apiAccountManagement);


export default api;
