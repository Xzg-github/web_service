import {getObject, fetchJson, postOption, showError, validValue, validArray, myToFixed} from './common';
import {fetchDictionary, setDictionary} from './dictionary';
import businessHelper from '../routes/order/common/jobUnitBusiness/business';
import {getTime} from './check';

const YES = 'true_false_type_true';
const NO = 'true_false_type_false';
const URL_JOB_UNIT_CONFIG = '/api/order/job_info_config';

const getDicList = ({formSections={}, tableSections={}, goodsDetailDialogConfig={}}) => {
  let dicList = [];
  Object.keys(formSections).map(key => {
    formSections[key].controls.map(obj => {
      if (obj.dictionary) {
        dicList.push(obj.dictionary);
      } else if (obj.from === 'dictionary' && obj.position && !obj.options) {
        dicList.push(obj.position);
      }
    });
  });
  Object.keys(tableSections).map(key => {
    tableSections[key].cols.map(obj => {
      if (obj.dictionary) {
        dicList.push(obj.dictionary);
      } else if (obj.from === 'dictionary' && obj.position && !obj.options) {
        dicList.push(obj.position);
      }
    });
  });
  if (goodsDetailDialogConfig.cols) {
    goodsDetailDialogConfig.cols.map(obj => {
      if (obj.dictionary) {
        dicList.push(obj.dictionary);
      } else if (obj.from === 'dictionary' && obj.position && !obj.options) {
        dicList.push(obj.position);
      }
    });
  }
  return dicList;
};

const setDic = (dic, {formSections, tableSections={}, goodsDetailDialogConfig={}}) => {
  Object.keys(formSections).map(key => {
    setDictionary(formSections[key].controls, dic);
  });
  Object.keys(tableSections).map(key => {
    setDictionary(tableSections[key].cols, dic);
  });
  if (goodsDetailDialogConfig.cols) {
    setDictionary(goodsDetailDialogConfig.cols, dic);
  }
};

//完善作业单元字典字段的下拉配置
const completeJobUnitInfoConfig = async (config) => {
  const names = getDicList(config);
  const {returnCode, result} = await fetchDictionary(names);
  if (returnCode !== 0) {
    showError('获取字典失败');
    return false;
  }
  setDic(result, config);
  return true;
};

//生成一个UUID
const makeUUID = () => {
  let s = [];
  let hexDigits = "0123456789abcdef";
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  return s.join("");
};

//判断是否为柜量固定为1且只读的柜型表格，若是则不进行初始化复制操作
const isSpecialCabinetNumber = (cols) => {
  const col = cols.filter(item => item.key === 'number').pop() || {};
  return col.type === 'readonly';
};

//将默认数据和主单信息初始化到作业单元
const initTaskUnitContentWithOrderInfo = (mainOrderInfo, serviceTypeCode, taskUnitCode, newTaskUnitContent, {formSections, tableSections, onSelfInit={}}) => {
  const {baseInfo={}, serviceTypeList=[], goodsDetailList=[], cabinetTypeList=[]} = mainOrderInfo;
  const index = serviceTypeList.findIndex(item => item.serviceTypeCode === serviceTypeCode);
  const serviceInfo = index >= 0 ? serviceTypeList[index].content || {} : {};
  let copyKeys = [];
  if (formSections) {
    Object.keys(formSections).map(key => {
      const needKeys = formSections[key].controls.map(item => item.key);
      copyKeys = copyKeys.concat(needKeys);
    });
  }
  const {defaultValue={}} = onSelfInit;
  const additionalDescription = serviceInfo.baseInfo && serviceInfo.baseInfo.additionalDescription ? `${serviceInfo.baseInfo.additionalDescription}； ${baseInfo.description || ''}` : baseInfo.description; //特殊处理附加说明字段，取服务类型中的和基本信息中的合集
  newTaskUnitContent.baseInfo = {...defaultValue.baseInfo, ...baseInfo, ...serviceInfo.baseInfo, additionalDescription};
  newTaskUnitContent.baseInfo = getObject(newTaskUnitContent.baseInfo, copyKeys);
  if (tableSections) {
    Object.keys(tableSections).map(key => {
      if (key === 'cabinetTypeList' && !isSpecialCabinetNumber(tableSections[key].cols)) {
        newTaskUnitContent[key] = cabinetTypeList.length > 0 ? cabinetTypeList.map(item => ({...item, lineNo: makeUUID()})) :
          (defaultValue[key] && Array.isArray(defaultValue[key])) ? defaultValue[key].map(item => ({...item, lineNo: makeUUID()})) : [];
      }else if (key === 'goodsDetailList') {
        newTaskUnitContent[key] = goodsDetailList.length > 0 ? goodsDetailList.map(item => ({...item, lineNo: makeUUID()})) :
          (defaultValue[key] && Array.isArray(defaultValue[key])) ? defaultValue[key].map(item => ({...item, lineNo: makeUUID()})) : [];
      }else if (key === 'deliveryAddrTypeList' && serviceTypeCode !== 'port_transport') { //港口服务类型相关作业单元该对应关系复杂，不适用通用复制过程
        newTaskUnitContent[key] = serviceInfo.list && serviceInfo.list.length > 0 ? serviceInfo.list.map(item => ({...item, lineNo: makeUUID()})) :
          (defaultValue[key] && Array.isArray(defaultValue[key])) ? defaultValue[key].map(item => ({...item, lineNo: makeUUID()})) : [];
      }else if (key === 'agentServiceList') {
        newTaskUnitContent[key] = serviceInfo.list && serviceInfo.list.length > 0 ? serviceInfo.list.map(item => ({...item, lineNo: makeUUID()})) :
          (defaultValue[key] && Array.isArray(defaultValue[key])) ? defaultValue[key].map(item => ({...item, lineNo: makeUUID()})) : [];
      }else {
        newTaskUnitContent[key] = (defaultValue[key] && Array.isArray(defaultValue[key])) ? defaultValue[key].map(item => ({...item, lineNo: makeUUID()})) : [];
      }
    });
  }
};

//根据已有数据对配置信息进行通用的初始化
//const initTaskUnitConfigWithData = async (config, taskUnitCode, newTaskUnitContent, mainOrderInfo) => {
//  return true;
//};

const initTaskUnitDataAndConfig = async (config, newTaskUnitContent, mainOrderInfo, serviceTypeCode, taskUnitCode) => {
  const isNew = !newTaskUnitContent.baseInfo;
  //新增的作业单元，用默认作业单元数据和主单信息初始化作业单元数据
  if (isNew) {
    initTaskUnitContentWithOrderInfo(mainOrderInfo, serviceTypeCode, taskUnitCode, newTaskUnitContent, config);
  } else { //已保存过或通过复制新增的作业单元，对必要的数据结构进行初始化完善
    newTaskUnitContent.baseInfo = newTaskUnitContent.baseInfo || {};
    if (config.tableSections) {
      Object.keys(config.tableSections).map(key => {
        newTaskUnitContent[key] = newTaskUnitContent[key] || [];
      });
    }
  }
  //根据已有数据对配置信息进行通用的初始化
  //if (! await initTaskUnitConfigWithData(config, taskUnitCode, newTaskUnitContent, mainOrderInfo)) return false;
  //对需要额外进行特殊初始化的作业单元，通用初始化完成后执行自定义初始化
  const {onSelfInit={}} = config;
  if (onSelfInit.requireInitFunc && !!businessHelper[taskUnitCode] && !!businessHelper[taskUnitCode].onInitEx) {
    return businessHelper[taskUnitCode].onInitEx(config, newTaskUnitContent, isNew, onSelfInit, mainOrderInfo, serviceTypeCode, taskUnitCode);
  }
  return true;
};

const getCarModeList = async () => {
  if (!global.carModeList) {
    const {result, returnCode} = await fetchJson('/api/basic/car_type/list', postOption({itemFrom:0, itemTo: 65536}));
    returnCode === 0 && (global.carModeList = result.data || []);
  }
  return global.carModeList || [];
};

/**
 * 功能：构造作业单元内容页面组件状态
 * 参数：jobUnitItem - [必需] 物流订单详细信息数据的作业单元列表taskUnitList中的一个作业单元记录数据
 *       mainOrderInfo - [必需] 物流订单详细信息数据的基本信息baseInfo
 *       readonly - [必需] 构造的作业单元页面是否为只读页面，true为只读，false为可编辑
 * 返回：作业单元组件状态
 */
const buildJobUnitState = async (jobUnitItem, mainOrderInfo, readonly) => {
  let {guid, taskUnitStatus, taskUnitCode, taskUnitTypeGuid, taskUnitTypeName, serviceTypeCode, taskUnitContent={}} = jobUnitItem;
  let data, config;
  if (!global.jobUnitConfig) {
    global.jobUnitConfig = {};
  }
  if (!global.jobUnitConfig[taskUnitCode]) {
    data = await fetchJson(`${URL_JOB_UNIT_CONFIG}/${taskUnitCode}`);
    if (data.returnCode !== 0) {
      showError(`${data.returnMsg}：${taskUnitTypeName}`);
      return;
    }
    if(!await completeJobUnitInfoConfig(data.result)) return;
    global.jobUnitConfig[taskUnitCode] = data.result;
  }
  config = global.jobUnitConfig[taskUnitCode];
  let {...newTaskUnitContent} = taskUnitContent;
  if (!await initTaskUnitDataAndConfig(config, newTaskUnitContent, mainOrderInfo, serviceTypeCode, taskUnitCode)) return;
  const realReadonly = (!taskUnitStatus || taskUnitStatus === 'task_unit_status_waiting_summit') ? readonly : true;
  return {
    ...config,
    readonly: realReadonly,
    guid,
    taskUnitCode,
    taskUnitTypeGuid,
    taskUnitStatus,
    taskUnitContent: newTaskUnitContent,
    baseInfo: mainOrderInfo.baseInfo,
    globalCarModeList: await getCarModeList()
  };
};

const modifyGoodsInfo = (goodsItems, info) => {
  info.goodsNumber = 0;
  info.roughWeight = 0;
  info.volume = 0;
  info.netWeight = 0;
  goodsItems.map(item => {
    info.goodsNumber += Number(item.goodsNumber || 0);
    info.roughWeight += Number(item.roughWeight || 0);
    info.volume += Number(item.volume || 0);
    info.netWeight += Number(item.netWeight || 0);
  });
  info.goodsNumber = myToFixed(info.goodsNumber);
  info.roughWeight = myToFixed(info.roughWeight);
  info.volume = myToFixed(info.volume);
  info.netWeight = myToFixed(info.netWeight);
};

const dealLineNo = (list=[]) => {
  return list.map(item => {
    const lineNo = makeUUID();
    return {...item, lineNo};
  });
};

//处理港口和中港相关作业单元pickupTime从表格取最小时间到baseInfo
const dealPickupTime = ({taskUnitCode, taskUnitContent}) => {
  switch (taskUnitCode) {
    case 'cross_border_container_export_transport':
    case 'cross_border_rent_container_export_transport':
    case 'cross_border_special_container_export_transport':
    case 'cross_border_tons_car_export_transport':
    case 'cross_border_tons_car_special_export_transport':
    case 'cross_border_container_import_transport':
    case 'cross_border_rent_container_import_transport':
    case 'cross_border_container_special_import_transport':
    case 'cross_border_tons_car_import_transport':
    case 'cross_border_tons_car_special_import_transport':
    case 'port_container_export_transport':
    case 'port_container_export_multi_point_transport':
    case 'port_container_special_export_transport':
    case 'supervise_warehouse_bulkcargo_export_transport':
    case 'port_transport_bulk_cargo_import_transport':
    case 'supervise_warehouse_bulkcargo_export_multi_point_transport':
    case 'supervise_warehouse_special_bulkcargo_export_transport':
    case 'port_container_import_transport':
    case 'port_container_import_multi_point_transport':
    case 'port_container_special_import_transport':
    case 'empty_container_transport':
    case 'cross_cabinet_transport':
    {
      taskUnitContent.baseInfo.pickupTime = getTime(taskUnitContent.cabinetTypeList, 'pickupTime');
      break;
    }
    case 'mainland_native_bulkload_transport':
    case 'mainland_native_agency_delivery':
    case 'mainland_native_vehicle_transport':
    case 'mainland_native_bulkload_transport_nike':
    case 'province_between_truck_capacity_transport':
    case 'province_between_truck_capacity_special_transport':
    case 'province_between_truck_less_capacity_transport':
    case 'province_between_truck_less_capacity_special_transport':
    case 'city_between_truck_capacity_special_transport':
    case 'city_between_truck_capacity_transport':
    case 'city_between_truck_less_capacity_transport':
    case 'city_between_truck_less_capacity_special_transport':
    case 'citywide_truck_capacity_transport':
    case 'citywide_truck_capacity_special_transport':
    case 'citywide_truck_less_capacity_transport':
    case 'citywide_truck_less_capacity_special_transport':
    case 'big_mainland_native_vehicle_transport':
    case 'big_mainland_native_breakbulk_transport':
    {
      taskUnitContent.baseInfo.pickupTime = getTime(taskUnitContent.deliveryAddrTypeList, 'pickupTime');
      break;
    }
  }
};

const bubbleSort = (arr=[]) => {
  for(let i = 0; i < arr.length-1; i++){
    for(let j = 0; j < arr.length-i-1; j++) {
      if(Number(arr[j].sequence || 65536) > Number(arr[j+1].sequence || 65536)) {
        let temp = arr[j];
        arr[j] = arr[j+1];
        arr[j+1] = temp;
      }
    }
  }
  return arr;
};

//处理站点顺序
const dealStations = ({taskUnitCode, taskUnitContent}) => {
  switch (taskUnitCode) {
    case 'mainland_native_vehicle_transport':
    {
      taskUnitContent.stationList = bubbleSort(taskUnitContent.stationList);
      break;
    }
  }
};

const dealIsUrgent = ({taskUnitContent}) => {
  const {pickupTime, cuttingFeedTime, cyCutOffTime} = taskUnitContent.baseInfo;
  if (!pickupTime) return;
  let isUrgent = NO;
  if (cuttingFeedTime && cuttingFeedTime.substr(0, 10) === pickupTime.substr(0, 10)) {
    isUrgent = YES;
  } else if (cyCutOffTime) {
    const time1 = Date.parse(pickupTime.substr(0, 10));
    const time2 = Date.parse(cyCutOffTime.substr(0, 10));
    if (parseInt((time2 - time1) / (1000 * 60 * 60 * 24)) <= 2) {
      isUrgent = YES;
    }
  }
  taskUnitContent.baseInfo.isUrgent = isUrgent;
};

//构造订单完善保存、提交操作接口输入参数的数据
const getSaveData = ({isEdit, taskUnitList, guid, ...otherState}) => {
  const newList = taskUnitList.map(item => {
    let newContent = {};
    const {taskUnitContent} = otherState[item.guid];
    const {baseInfo={}, ...otherList} = taskUnitContent;
    newContent.baseInfo = {...baseInfo};
    Object.keys(otherList).map(key => {
      newContent[key] = otherList[key];
      if(key === 'goodsDetailList') {
        modifyGoodsInfo(newContent[key], newContent.baseInfo);
        !isEdit && (newContent[key] = dealLineNo(newContent[key]));
      }
    });
    let newItem = Object.assign({}, item, {taskUnitContent: newContent});
    dealPickupTime(newItem);
    dealIsUrgent(newItem); //是否急单标识
    dealStations(newItem);
    return newItem;
  });
  return {logisticsOrderGuid: guid, taskUnitList: newList};
};

//校验单个作业单元数据
const checkJobUnit = async (action, dispatch, activeKey, state) => {
  const {taskUnitCode, taskUnitContent, formSections, tableSections} = state;
  //主表单必填项校验
  for (let key of Object.keys(formSections)) {
    const {controls=[], hideControls=[]} = formSections[key];
    const checkControls = controls.filter(item => !hideControls.includes(item.key));
    if (!validValue(checkControls, taskUnitContent.baseInfo || {})) {
      dispatch(action.assign({[key]: true}, [activeKey, 'valid']));
      return false;
    }
  }
  //表格必填项校验
  if (tableSections) {
    for (let tableKey of Object.keys(tableSections)) {
      if (taskUnitContent[tableKey]) {
        const list = taskUnitContent[tableKey];
        //校验表格记录数
        if(tableKey === 'deliveryAddrTypeList' && taskUnitContent.baseInfo) {
          if(taskUnitContent.baseInfo.isMultiPlace === YES && list.length < 2) {
            showError('多点提送货装卸货地址记录数应大于2');
            dispatch(action.assign({[tableKey]: true}, [activeKey, 'valid']));
            return false;
          }else if(taskUnitContent.baseInfo.isMultiPlace === NO && list.length !== 1) {
            showError('必须只有一条装卸货地址记录');
            dispatch(action.assign({[tableKey]: true}, [activeKey, 'valid']));
            return false;
          }
        }else if (tableKey === 'goodsDetailList' && list.length < 1) {
          showError('必须有货物信息记录');
          dispatch(action.assign({[tableKey]: true}, [activeKey, 'valid']));
          return false;
        }
        //检查必填项和数据
        if (!validArray(tableSections[tableKey].cols, list)) {
          dispatch(action.assign({[tableKey]: true}, [activeKey, 'valid']));
          return false;
        }
      }
    }
  }
  return true;
};

const orderJobHelper = {
  completeJobUnitInfoConfig,
  initTaskUnitContentWithOrderInfo,
  buildJobUnitState,
  getSaveData,
  checkJobUnit,
  makeUUID,
  dealPickupTime,
  getCarModeList
};

export {
  buildJobUnitState,
  getSaveData,
  checkJobUnit,
  modifyGoodsInfo,
  makeUUID,
  dealPickupTime
};

export default orderJobHelper;
