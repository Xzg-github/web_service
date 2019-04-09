
const data = {
  returnCode: 0,
  result: {
    signature: '文件签署管理',

    //电子签署个人账号可拥有权限
    econtract_personal_role: {
      signature_center: '签署中心',
      my_papers: '我的文件',
      //enterprise_documents: '企业文件',
      file_management: '档案管理',
      account_management: '账号管理',
      //signature_group: '签署群组',
      contacts:'联系人',
      //template_management: '模板管理',
      //personal_certification: '个人认证',
      personal_account_management: '个人账号管理'
    },

    //电子签署企业账号
    econtract_company_role: {
      signature_center: '签署中心',
      my_papers: '我的文件',
      // data_statistics: '数据统计',
      //monthly_bill: '月账单',
      file_management: '档案管理',
      account_management: '账号管理',
     //enterprise_documents: '企业文件',
      worker: '企业员工',
      contacts: '联系人',
      //signature_group: '签署群组',
      //template_management: '模板管理',
      //enterprise_certification: '企业认证',
      enterprise_account_management: '企业账号管理'
    },

    //电子签署平台运营
    econtract_admin_role: {
      business_account: '企业账户金额',
      businessOrder: '企业订单',
      // data_statistics: '数据统计',
      //monthly_bill: '月账单',
      businessArchives: '企业档案',
      monthly_bill: '月账单',
      // businessArchives: '企业档案',
      file_management: '档案管理',
      personalProfile: '个人账号档案',
      businessProject: '业务项目',
      price_management: '价格管理'
    },

    // signature: '文件签署管理',
    //
    //
    // signature_center: '签署中心',
    // my_papers: '我的文件',
    // data_statistics: '数据统计',
    // monthly_bill: '月账单',
    // enterprise_documents: '企业文件',
    // file_management: '档案管理',
    // company_file_management: '企业档案管理',
    // account_management: '账号管理',
    // business_account: '企业账户金额',
    // businessOrder: '企业订单',
    //
    // worker: '企业员工',
    // contacts: '联系人',
    // signature_group: '签署群组',
    // template_management: '模板管理',
    // businessArchives: '企业档案',
    // personalProfile: '个人账号档案',
    // businessProject: '业务项目',
    // price_management: '价格管理',
    //
    //
    // enterprise_certification: '企业认证',
    // enterprise_account_management: '企业账号管理',
    // personal_certification: '个人认证',
    // personal_account_management: '个人账号管理',

  }
};

export default data;
