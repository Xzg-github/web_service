import React from 'react';
import RouterHelper from '../RouteHelper';

const title = '文件签署管理';
const prefix = '/signature';

const children = [
    require('./signature_center').default,
    require('./my_papers').default,
    require('./data_statistics').default,
    require('./monthly_bill').default,
    require('./enterprise_documents').default,
    require('./file_management/contacts').default,
    require('./file_management/enterprise_staff').default,
    require('./file_management/signature_group').default,
    require('./file_management/template_management').default,
    require('./file_management/price_management').default,
    require('./account_management/enterprise_account_management').default,
    require('./account_management/enterprise_certification').default,
    require('./account_management/personal_certification').default,
    require('./account_management/personal_account_management').default,
    require('./business_account').default,
    require('./file_management/businessArchives').default
];

export default RouterHelper(prefix, title, children);
