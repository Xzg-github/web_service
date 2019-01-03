/**
 * 一级导航及侧边栏的配置信息
 * key：url的一部分
 * prefix：如果不存在，公共权限字典中资源代码的值就是key，如果存在则为`${prefix}_${key}`
 * icon: 菜单的图标名，一级导航中不存在该字段
 */

// 导航条(一级导航)
const NAV_ITEMS = [
    {key: 'signature'},    // 文件签署管理
];



//档案管理
const file = [
    {key: 'enterprise_staff'},  //企业员工
    {key: 'contacts'},   //联系人档案
    {key: 'signature_group'}, //签署群组
    {key: 'template_management'}, //模板管理
];


//账号管理
const account = [
    {key: 'enterprise_certification'}, //企业认证
    {key: 'enterprise_account_management'}, //企业账号管理
];

const signature = [
    {key:'signature_center', icon: 'pld-picture'},     //签署中心
    {key:'my_papers', icon: 'pld-picture'},            //我的文件
    {key:'data_statistics', icon: 'pld-picture'},             //数据统计
    {key:'monthly_bill', icon: 'pld-picture'},             //月账单
    {key:'enterprise_documents', icon: 'pld-picture'},             //企业文件
    {key:'file_management', icon: 'pld-picture',children:file},             //档案管理
    {key:'account_management', icon: 'pld-picture',children:account},           //账号管理
];

// 所有侧边栏
const SIDEBARS = {
    signature
};

export {NAV_ITEMS, SIDEBARS};
