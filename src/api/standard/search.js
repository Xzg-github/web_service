import {host, maxSearchCount,fadadaServiceName} from '../gloablConfig';
import {fetchJsonByNode, postOption} from '../../common/common';

const handlers = {};

// 搜索5级地址
handlers['area'] = (req, filter) => {
  const url = `${host}/archiver_service/archiver/transport_place/drop_list`;
  const option = postOption({maxNumber: maxSearchCount, placeName: filter});
  return fetchJsonByNode(req, url, option);
};

// 搜索费用项名称
handlers['charge_item'] = async (req, filter) => {
  const url = `${host}/charge_service/charge_item/search`;
  const option = postOption({itemFrom: 0, itemTo: maxSearchCount, filter: {chargeName: filter}});
  const json = await fetchJsonByNode(req, url, option);
  const convert = (item) => ({value: item.guid, title: item.chargeName});
  return json.returnCode === 0 ? {returnCode: 0, result: json.result.data.map(convert)} : json;
};

// 车型
handlers['carMode'] = (req, filter) => {
  const url = `${host}/archiver_service/car_mode/drop_list`;
  const option = postOption({maxNumber: maxSearchCount,carMode:filter});
  return fetchJsonByNode(req, url, option);
};

// 起运地
handlers['transportPlace'] = (req, filter) => {
  const url = `${host}/archiver_service/archiver/transport_place/charge/drop_list`;
  const option = postOption({maxNumber: maxSearchCount,placeName:filter});
  return fetchJsonByNode(req, url, option);
};

// 客户
handlers['customer'] = (req, filter) => {
  const url = `${host}/customer_service/customer/drop_list`;
  const option = postOption({maxNumber: maxSearchCount,customerName:filter});
  return fetchJsonByNode(req, url, option);
};

// 供应商
handlers['supplier'] = (req, filter) => {
  const url = `${host}/supplier_service/supplier/drop_list`;
  const option = postOption({maxNumber: maxSearchCount,supplierType:"supplier_type_cooperation",supplierName:filter});
  return fetchJsonByNode(req, url, option);
};

// 组织机构
handlers['institution'] = (req, filter) => {
  const url = `${host}/tenant-service/institution/drop_list`;
  const option = postOption({institutionName:filter});
  return fetchJsonByNode(req, url, option);
};

// 提柜地
handlers['location'] = (req, filter) => {
  const url = `${host}/archiver_service/archiver/location/drop_list`;
  const option = postOption({locationName:filter,maxNumber:maxSearchCount});
  return fetchJsonByNode(req, url, option);
};

// 订单归属
handlers['factory'] = (req, filter) => {
  const url = `${host}/archiver_service/factory/drop_list`;
  const option = postOption({filter:filter,maxNumber:maxSearchCount});
  return fetchJsonByNode(req, url, option);
};

// 作业单元code
handlers['job_unit_code'] = async (req) => {
  const url = `${host}/production-service/task_unit_type/active/list`;
  const json = await fetchJsonByNode(req, url);
  const convert = (item) => ({value: item.taskUnitCode, title: item.taskUnitTypeName});
  return json.returnCode === 0 ? {returnCode:0,result:json.result.map(convert)} : [];
};

// 用户
handlers['user'] = async(req, filter) => {
  const url = `${host}/tenant_service/user/drop_list`;
  const body = {filter:filter,maxNumber: maxSearchCount};
  const json = await fetchJsonByNode(req, url, postOption(body));
  const convert = (item) => ({value: item.guid, title: item.username});
  return json.returnCode === 0 ? {returnCode: 0, result: json.result.map(convert)} : json;
};

export const search = async (req, type, filter='') => {
  const handler = handlers[type];
  return handler ? await handler(req, filter) : {returnCode: 404, returnMsg: `类型[${type}]不存在`};
};
