import { combineReducers } from 'redux';
import {createReducer} from '../action-reducer/reducer';
import {mapReducer} from '../action-reducer/combine';
import password from './password';

/*
* 功能：创建标准reducer结构
* 参数： key: 模块标识，一般使用对应模块侧边栏key的驼峰名
*       isTabPage： 主页面是否为需要tab页签页面扩展，默认true，会创建一个路径加edit的reducer
* */
const create = (key, isTabPage=true) => {
    const prefix = [key];
    if (isTabPage) {
        const edit = createReducer(prefix.concat('edit'));
        const toEdit = ({activeKey}, {payload={}}) => {
            const key = payload.currentKey || activeKey;
            return key !== 'index' ? {keys: [key], reducer: edit} : {};
        };
        return createReducer(prefix, mapReducer(toEdit));
    }else {
        return createReducer(prefix);
    }
};


const rootReducer = combineReducers({
    layout: createReducer(['layout']),
    home: createReducer(['home']),
    temp: createReducer(['temp']),
    password,
    signature_center: create('signature_center'),
    my_papers: create('my_papers',false),
    data_statistics: create('data_statistics'),
    monthly_bill: create('monthly_bill',false),
    business_account: create('business_account'),
    registered: create('registered', false),

    enterprise_documents: create('enterprise_documents',false),
    enterprise_documents_edit:  createReducer(['enterprise_documents_edit']),

    //档案管理
    enterprise_staff: create('enterprise_staff',false),
    contacts: create('contacts',false),
    signature_group: create('signature_group',false),
    template_management: create('template_management',false),
    //账号管理
    enterprise_certification: create('enterprise_certification',false),
    enterprise_account_management: create('enterprise_account_management'),
    personal_certification: create('personal_certification'),
    personal_account_management: create('personal_account_management'),
    fadada: create('fadada'),
});

export default rootReducer;
