
import {fetchDictionary, setDictionary} from './dictionary';
import {deepAssignObj} from '../action-reducer/helper';
import {toFormValue, toTableValue} from '../common/check';
import {validValue, showError, fetchJson, myToFixed} from '../common/common';
import orderJobHelper from './jobUnitInfo';

const YES = 'true_false_type_true';
const NO = 'true_false_type_false';
const URL_ORDER_INFO = '/api/order/info';
const URL_CONFIG = '/api/order/order_info_config';
const URL_OTHER = '/api/llp/waite/other';

const getOrderInfoData = async (guid) => {
  const {returnCode, result, returnMsg} = await fetchJson(`${URL_ORDER_INFO}/${guid}`);
  if(returnCode !== 0) {
    showError(returnMsg);
    return;
  }
  return result;
};

const getDicList = (dicList, objArr=[]) => {
  objArr.map(obj => {
    if (obj.dictionary) {
      dicList.push(obj.dictionary);
    } else if (obj.from === 'dictionary' && obj.position && !obj.options) {
      dicList.push(obj.position);
    }
  });
};

const getOrderInfoConfigDicList = ({baseInfoConfig, serviceConfig, goodsFormConfig, tableSectionsConfig}) => {
  let dicList = [];
  getDicList(dicList, baseInfoConfig.controls);
  getDicList(dicList, goodsFormConfig.controls);
  Object.keys(serviceConfig).map(key => {
    getDicList(dicList, serviceConfig[key].controls);
    serviceConfig[key].table ? getDicList(dicList, serviceConfig[key].table.cols) : null;
  });
  Object.keys(tableSectionsConfig).map(key => {
    getDicList(dicList, tableSectionsConfig[key].cols)
  });
  return dicList;
};

const setOrderInfoConfigDictionary = ({baseInfoConfig, serviceConfig, goodsFormConfig, tableSectionsConfig}, dic) => {
  setDictionary(baseInfoConfig.controls, dic);
  setDictionary(goodsFormConfig.controls, dic);
  Object.keys(serviceConfig).map(key => {
    setDictionary(serviceConfig[key].controls, dic);
    serviceConfig[key].table ? setDictionary(serviceConfig[key].table.cols, dic) : null;
  });
  Object.keys(tableSectionsConfig).map(key => {
    setDictionary(tableSectionsConfig[key].cols, dic);
  });
};

const bindEmpty = (ignores = []) => {
  if (ignores.length === 0) {
    return obj => Object.keys(obj).every(key => !obj[key]);
  } else {
    const keys = obj => Object.keys(obj).filter(key => ignores.indexOf(key) === -1);
    return obj => keys(obj).every(key => !obj[key]);
  }
};

const isEmpty = bindEmpty(['checked', 'lineNo']);

const trimEmpty = (arr = []) => {
  return arr.reduce((newArr, item) => {
    if (!isEmpty(item)) {
      newArr.push(item);
    }
    return newArr;
  }, []);
};

//完善订单列表页面来自字典的字段下拉配置
const completeListConfig = async ({tableCols, filters, dicNames=[]}) => {
  const dictionary = await fetchDictionary(dicNames);
  if (dictionary.returnCode !== 0) {
    showError(dictionary.returnMsg);
    return false;
  }
  setDictionary(tableCols, dictionary.result);
  setDictionary(filters, dictionary.result);
  return true;
};

//完善主订单详细信息页面来自字典的字段下拉配置及服务类型配置
const completeOrderInfoConfig = async (config) => {
  const dicList = getOrderInfoConfigDicList(config);
  const dictionary = await fetchDictionary(dicList);
  if (dictionary.returnCode !== 0) {
    showError(dictionary.returnMsg);
    return false;
  }
  setOrderInfoConfigDictionary(config, dictionary.result);
  if (typeof(Storage) !== "undefined") {
    const strServiceConfig = localStorage.getItem("serviceConfig");
    if (strServiceConfig) {
      const showArr = strServiceConfig.split(',');
      Object.keys(config.serviceConfig).map(key => {
        config.serviceConfig[key].hide = showArr.findIndex(item => item === key) === -1;
      });
    }
  }
  return true;
};

//将数组[{key, ...},...] 转成对象{key:{key, ...}, ...}, 用来将服务类型数据由数组转对象
const listToObject = (list=[], key) => {
  return list.reduce((obj, item) => {
    obj[item[key]] = Object.assign(item, {checked: true});
    return obj;
  }, {});
};

//将对象{key:{...}, ...} 转成数组[{ ...},...], 用来将服务类型有效数据由对象转成数组
const toServiceList = (serviceObj) => {
  return Object.keys(serviceObj).reduce((arr, key) => {
    if(!serviceObj[key]) return arr;
    if (serviceObj[key].content && serviceObj[key].content.list) {
      const list = trimEmpty(serviceObj[key].content.list);
      const content = Object.assign({}, serviceObj[key].content, {list});
      arr.push(Object.assign({}, serviceObj[key], {content}));
    } else {
      arr.push(serviceObj[key]);
    }
    return arr;
  }, []);
};

//获取主订单详细信息保存、提交时接口所需的有效数据及参数结构
const getSaveData = ({baseInfo, goodsDetailList, cabinetTypeList, serviceTypeList, tableSectionsConfig}, isEdit = true) => {
  const {guid, ...newBaseInfo} = baseInfo;
  const {goodsConfig} = tableSectionsConfig;
  let saveData = {
    baseInfo: toFormValue(isEdit ? baseInfo : newBaseInfo, ['contactName', 'overseaAgent']),
    serviceTypeList: toServiceList(serviceTypeList)
  };
  saveData.goodsDetailList = toTableValue(trimEmpty(goodsDetailList));
  saveData.cabinetTypeList = toTableValue(trimEmpty(cabinetTypeList));
  if(goodsConfig.show) {
    let goodsNumber=0, volume=0, roughWeight=0, netWeight=0, pieceNumber=0;
    saveData.goodsDetailList.map(item => {
      goodsNumber += Number(item.goodsNumber || 0);
      volume += Number(item.volume || 0);
      roughWeight += Number(item.roughWeight || 0);
      netWeight += Number(item.netWeight || 0);
      pieceNumber += Number(item.pieceNumber || 0);
    });
    saveData.baseInfo = Object.assign({}, saveData.baseInfo, {
      goodsNumber: myToFixed(goodsNumber),
      volume: myToFixed(volume),
      roughWeight: myToFixed(roughWeight),
      netWeight: myToFixed(netWeight),
      pieceNumber: myToFixed(pieceNumber)
    });
  }
  return saveData;
};

//主订单配置服务类型功能响应
const onServiceConfigEx = (dispatch, selfState, action, values) => {
  const {serviceConfig} = selfState;
  let {...newServiceConfig} = serviceConfig;
  Object.keys(serviceConfig).map(key => {
    const hide = values.findIndex(value => value === key) < 0;
    newServiceConfig[key] = Object.assign({}, newServiceConfig[key], {hide});
  });
  global.orderInfoConfig.serviceConfig = newServiceConfig;
  if (typeof(Storage) !== "undefined") {
    localStorage.setItem("serviceConfig", values);
  }
  dispatch(action.assign({serviceConfig: newServiceConfig}));
};

//服务类型默认值设置
const defaultValue = {
  mainland_native_transport: {baseInfo:{isNeedSupervisor: YES}}
};

//主订单服务类型改变的处理函数--改变相关数据及界面配置
const onServiceChangeEx = (dispatch, selfState, action, arr) => {
  const {serviceTypeList={}, serviceConfig, goodsFormConfig, tableSectionsConfig, baseInfo, goodsDetailList=[]} = selfState;
  //先检测是否已经填写了委托客户
  if(!baseInfo.customerGuid) {
    dispatch(action.assign({valid: true}, ['valid', 'baseInfoConfig']));
    return;
  }
  let requireGoods = false, requireCabinets = false;
  let newServiceTypeList = arr.reduce((obj, key)=> {
    requireGoods = requireGoods || serviceConfig[key].requireGoods;
    requireCabinets = requireCabinets || serviceConfig[key].requireCabinets;
    obj[key] = Object.assign({}, serviceTypeList[key], {checked: true, serviceTypeCode: key});
    obj[key].content = obj[key].content || defaultValue[key] || {};
    return obj;
  }, {});
  dispatch(action.assign({serviceTypeList: newServiceTypeList}));
  dispatch(action.assign({show: requireGoods}, ['tableSectionsConfig', 'goodsConfig']));
  dispatch(action.assign({show: requireCabinets}, ['tableSectionsConfig', 'cabinetConfig']));
  if(requireGoods) {
    let newBaseInfo = Object.assign({}, baseInfo, {goodsName:'', goodsNumber:'', packageUnit:'', volume:'', roughWeight:'', netWeight:'', shippingMark:''});
    dispatch(action.assign({baseInfo: newBaseInfo}));
  }else {
    dispatch(action.assign({goodsDetailList: [{}]}));
  }
  if(goodsDetailList.length < 1) {
    dispatch(action.assign({goodsDetailList: [{}]}));
  }
  !requireCabinets && dispatch(action.assign({cabinetTypeList: []}));
  //联动改变柜型表格必填项配置
  let cols = tableSectionsConfig.cabinetConfig.cols.map(item => { //设置默认必填项
    const required = !(item.key === 'index' || item.key === 'checked' || item.key === 'carRemark');
    return Object.assign({}, item, {required});
  });
  if (newServiceTypeList.port_transport || newServiceTypeList.sea_transport) { //港口、海运中重量、体积非必填
    cols = cols.map(item => {
      return (item.key === 'weight' || item.key === 'volume') ? Object.assign({}, item, {required:false}) : item;
    });
  }
  if (newServiceTypeList.mainland_hk_transport) { //中港运输全部非必填
    cols = cols.map(item => Object.assign({}, item, {required:false}));
  }
  //当服务类型有代办及单证服务时，货物信息表单都非必填
  let controls = global.orderInfoConfig.goodsFormConfig.controls;
  if (newServiceTypeList.agent_operation) {
    controls = goodsFormConfig.controls.map(control => ({...control, required: false}));
  }
  dispatch(action.assign({controls}, ['goodsFormConfig']));
  dispatch(action.assign({cols}, ['tableSectionsConfig', 'cabinetConfig']));
};

/////////////////////////////////// 主订单校验 start //////////////////////////////////////////////////////////////////
//校验服务类型下装卸货地址表格记录数是否符合多点运输业务条件
const checkAddrList = (action, dispatch, serviceKey, serviceName, {isMultiPlace}, list=[], hideErrorMsg=false) => {
  if (list.length < 1) {
    !hideErrorMsg && showError(`${serviceName}装卸货地址列表不能为空`);
    dispatch(action.assign({valid: true}, ['validTable', serviceKey]));
    return false;
  }
  if(isMultiPlace === 'true_false_type_true' && list.length < 2) {
    !hideErrorMsg && showError(`${serviceName}多点提送货需要2个以上装卸货地址记录`);
    dispatch(action.assign({valid: true}, ['validTable', serviceKey]));
    return false;
  }
  if(isMultiPlace === 'true_false_type_false' && list.length > 1) {
    !hideErrorMsg && showError(`${serviceName}非多点提送货只能有一条装卸货地址记录`);
    return false;
  }
  return true;
};

//遍历校验各服务类型数据
const checkService = (serviceListObj, config, dispatch, action, hideErrorMsg=false) => {
  for (let key of Object.keys(serviceListObj)) {
    const {content={}} = serviceListObj[key];
    const {baseInfo={}, list=[]} = content || {};
    //校验表单必填项
    const {controls=[], hideControls=[]} = config[key];
    const checkControls = controls.filter(item => !hideControls.includes(item.key));
    if (!validValue(checkControls, baseInfo)) {
      dispatch(action.assign({valid: true}, ['serviceTypeList', key]));
      return false;
    }
    //校验表格有效记录必填项
    let newList = trimEmpty(list);
    for (let item of newList) {
      if (!validValue(config[key].table.cols, item)) {
        dispatch(action.assign({valid: true}, ['validTable', key]));
        return false;
      }
    }
    //其他特殊业务逻辑校验
    switch (key) {
      case 'mainland_native_transport': //国内运输
      {
        if(!checkAddrList(action, dispatch, key, config[key].title, baseInfo, newList, hideErrorMsg)) return false;
        break;
      }
    }
  }
  return true;
};

//导出的校验函数
const check = (action, dispatch, selfState, hideErrorMsg=false, isNormalOrder=true) => {
  const {baseInfo, goodsDetailList, cabinetTypeList, serviceTypeList, baseInfoConfig, serviceConfig, goodsFormConfig, tableSectionsConfig} = selfState;
  const {goodsConfig, cabinetConfig} = tableSectionsConfig;
  //////////主订单基本信息表单数据校验
  if (!validValue(baseInfoConfig.controls, baseInfo)) {
    dispatch(action.assign({valid: true}, ['valid', 'baseInfoConfig']));
    return false;
  }
  //////////服务类型勾选校验
  if (isNormalOrder && Object.keys(serviceTypeList).length < 1) {
    !hideErrorMsg && showError('必须勾选一种以上服务类型');
    return false;
  }
  //////////服务类型详细信息校验
  if(isNormalOrder && !checkService(serviceTypeList, serviceConfig, dispatch, action, hideErrorMsg)) {
    return false;
  }
  //////////主订单货物信息校验
  if (!goodsConfig.show || !isNormalOrder) { //货物信息为表单
    if (!validValue(goodsFormConfig.controls, baseInfo)) {
      dispatch(action.assign({valid: true}, ['valid', 'goodsFormConfig']));
      return false;
    }
    //if (Number(baseInfo.roughWeight) < Number(baseInfo.netWeight)) {
    //  !hideErrorMsg && showError('毛重不能小于净重');
    //  return false;
    //}
  }else { //货物信息为表格
    const goods = trimEmpty(goodsDetailList);
    if(goods.length < 1) {
      !hideErrorMsg && showError('货物明细至少要一条记录');
      dispatch(action.assign({valid: true}, ['validTable', 'goodsDetailList']));
      return false;
    }
    for (let goodsItem of goods) {
      if (!validValue(goodsConfig.cols, goodsItem)) {
        dispatch(action.assign({valid: true}, ['validTable', 'goodsDetailList']));
        return false;
      }
      //if (Number(goodsItem.roughWeight) < Number(goodsItem.netWeight)) {
      //  !hideErrorMsg && showError('毛重不能小于净重');
      //  return false;
      //}
    }
  }
  //////////柜型/量表格校验
  const cabinets = trimEmpty(cabinetTypeList);
  for (let cabinetItem of cabinets) {
    if (!validValue(cabinetConfig.cols, cabinetItem)) {
      dispatch(action.assign({valid: true}, ['validTable', 'cabinetTypeList']));
      return false;
    }
  }
  return true;
};
/////////////////////////////////// 主订单校验 end ////////////////////////////////////////////////////////////////////


/////////////////////////////////// 主订单数据初始化界面配置 start ////////////////////////////////////////////////////
//跟据主订单详细信息初始数据初始化界面配置
const initConfigWithData = (config, orderInfo) => {
  let newConfig = config;
  const {baseInfo={}, serviceTypeList=[]} = orderInfo;
  //根据订单数据初始化主单基本信息界面配置
  let newHides = ['salesPersonGuid', 'overseaAgent', 'agentPerson',
    'freezeRequire', 'fixRequire', 'hazardLevel', 'hazardRemark', 'specificationRequire'];
  if(baseInfo.canvassionMode === 'canvassion_mode_001') {
    newHides = newHides.filter(item => item !== 'salesPersonGuid');
  }else if (baseInfo.canvassionMode === 'canvassion_mode_002') {
    newHides = newHides.filter(item => item !== 'overseaAgent' && item !== 'agentPerson');
  }
  if(baseInfo.goodsCategory === 'goods_category_002') {
    newHides = newHides.filter(item => item !== 'hazardLevel' && item !== 'hazardRemark');
  } else if(baseInfo.goodsCategory === 'goods_category_003') {
    newHides = newHides.filter(item => item !== 'freezeRequire' && item !== 'fixRequire');
  } else if(baseInfo.goodsCategory === 'goods_category_004') {
    newHides = newHides.filter(item => item !== 'specificationRequire');
  }
  newConfig = deepAssignObj(newConfig, {hideControls: newHides}, ['baseInfoConfig']);

  //根据订单数据初始化主单货物明细表格或表单和车柜型量表格是否显示的界面配置
  let requireGoods = false, requireCabinets = false;
  serviceTypeList.map(obj => {
    const key = obj.serviceTypeCode;
    if(newConfig.serviceConfig[key]) {
      requireGoods = requireGoods || newConfig.serviceConfig[key].requireGoods;
      requireCabinets = requireCabinets || newConfig.serviceConfig[key].requireCabinets;
    }else {
      showError(`订单数据无法完全打开，需要先分配“${obj.serviceTypeCode}”物流产品权限`);
    }
  });
  newConfig = deepAssignObj(newConfig, {show: requireGoods}, ['tableSectionsConfig', 'goodsConfig']);
  newConfig = deepAssignObj(newConfig, {show: requireCabinets}, ['tableSectionsConfig', 'cabinetConfig']);
  if (serviceTypeList.length <= 0) return newConfig;

  //根据订单服务类型数据初始化主单车柜型量表格必填项的界面配置
  const servicesObj = listToObject(serviceTypeList, 'serviceTypeCode');
  if (servicesObj.port_transport || servicesObj.sea_transport) { //港口、海运中重量、体积非必填
    const cols = newConfig.tableSectionsConfig.cabinetConfig.cols.map(item => {
      return (item.key === 'weight' || item.key === 'volume') ? Object.assign({}, item, {required:false}) : item;
    });
    newConfig = deepAssignObj(newConfig, {cols}, ['tableSectionsConfig', 'cabinetConfig']);
  }
  if (servicesObj.mainland_hk_transport) { //中港运输全部非必填
    const cols = newConfig.tableSectionsConfig.cabinetConfig.cols.map(item => Object.assign({}, item, {required:false}));
    newConfig = deepAssignObj(newConfig, {cols}, ['tableSectionsConfig', 'cabinetConfig']);
  }

  ////////////// 根据订单服务类型详细信息数据数据初始化各服务类型界面配置 ///////////////////////
  //中港运输
  if(servicesObj.mainland_hk_transport && servicesObj.mainland_hk_transport.content
    && servicesObj.mainland_hk_transport.content.baseInfo) {
    const {isCustoms, isHkCustoms} = servicesObj.mainland_hk_transport.content.baseInfo;
    let [...controls] = newConfig.serviceConfig.mainland_hk_transport.controls;
    let changeKeys = ['mainlandCustomsId', 'mainlandCustomsContact', 'mainlandCustomsContactPhone'];
    let required = (isCustoms === 'true_false_type_true');
    controls = controls.map(item => {
      return changeKeys.every(changeKey => changeKey !== item.key) ? item : Object.assign({}, item, {required});
    });
    changeKeys = ['hkCustomsId', 'hkCustomsContact', 'hkCustomsContactPhone'];
    required = (isHkCustoms === 'true_false_type_true');
    controls = controls.map(item => {
      return changeKeys.every(changeKey => changeKey !== item.key) ? item : Object.assign({}, item, {required});
    });
    newConfig = deepAssignObj(newConfig, {controls}, ['serviceConfig', 'mainland_hk_transport']);
  }

  //港口运输
  if(servicesObj.port_transport && servicesObj.port_transport.content
    && servicesObj.port_transport.content.baseInfo) {
    const {customsType} = servicesObj.port_transport.content.baseInfo;
    let [...hideControls] = newConfig.serviceConfig.port_transport.hideControls || [];
    if(customsType === 'Customs_Type_001') {
      hideControls = hideControls.filter(hideKey => hideKey !== 'customsPort');
    }else {
      hideControls = hideControls.concat(['customsPort']);
    }
    newConfig = deepAssignObj(newConfig, {hideControls}, ['serviceConfig', 'port_transport']);
  }

  //转DO
  if(servicesObj.transform_do && servicesObj.transform_do.content
    && servicesObj.transform_do.content.baseInfo) {
    const {isPrepay, paymentWay} = servicesObj.transform_do.content.baseInfo;
    let hideControls;
    if(isPrepay === YES) {
      if (paymentWay === 'payment_way_001') {
        hideControls = ['bankCountInformation'];
      }else if (paymentWay === 'payment_way_002') {
        hideControls = ['checkHeaderInformation'];
      } else {
        hideControls = ['checkHeaderInformation', 'bankCountInformation'];
      }
    }else {
      hideControls = ['prepayCurrency', 'prepayMoney', 'paymentWay', 'checkHeaderInformation', 'bankCountInformation'];
    }
    newConfig = deepAssignObj(newConfig, {hideControls}, ['serviceConfig', 'transform_do']);
  }
  return newConfig;
};
/////////////////////////////////// 主订单数据初始化界面配置 end //////////////////////////////////////////////////////


///////////////////////////// 订单主页面初始化函数 ////////////////////////////////////////////////////////////////////
/**
 * 功能：构造物流订单基本信息页面组件状态
 * 参数：orderInfoData - [可选] 物流订单详细信息数据,为空时必须传orderId参数
 *       orderId - [可选] 物流订单guid,为空时必须传orderInfoData参数
 *       isEdit - [必需] 构造的物流订单基本信息页面是否为编辑页面，true为编辑订单，false为新增订单
 *       readonly - [必需] 构造的物流订单基本信息页面是否为只读页面，true为只读，false为可编辑
 *       llpId - [可选] 构造物流订单页面位置若来自商流订单，则需填写记录对应的商流订单标识
 * 返回：物流订单基本信息页面组件状态
 */
const buildCommonOrderInfoState = async (orderInfoData, orderId, isEdit, readonly, llpId = undefined) => {
  if (!orderInfoData && !orderId) return;
  if (!orderInfoData) {
    orderInfoData = await getOrderInfoData(orderId);
    if (!orderInfoData) return;
  }
  let data, config;
  if (!global.orderInfoConfig) {
    data = await fetchJson(URL_CONFIG);
    if(data.returnCode !== 0) {
      showError('get orderInfoConfig failed');
      return;
    }
    if (!await completeOrderInfoConfig(data.result)) return;
    global.orderInfoConfig = data.result;
  }
  config = global.orderInfoConfig;
  config = initConfigWithData(config, orderInfoData);
  let {baseInfo={}, serviceTypeList=[], goodsDetailList=[{}], cabinetTypeList=[]} = orderInfoData;
  if(!isEdit) {
    const controls = config.baseInfoConfig.controls.map(item => {
      if(item.key === 'customerGuid' && !baseInfo.customerGuid) return Object.assign({}, item, item.addMode);
      return item;
    });
    config = deepAssignObj(config, {controls}, ['baseInfoConfig']);
  }
  serviceTypeList = listToObject(serviceTypeList, 'serviceTypeCode');
  let confiscateList = [];
  if (llpId) {
    data = await fetchJson(`${URL_OTHER}/${llpId}`);
    if(data.returnCode !== 0) {
      showError(data.returnMsg);
      return;
    }
    confiscateList = data.result || [];
    if(confiscateList.length > 0) {
      confiscateList = confiscateList.map(item => ({...item, customer: item.customer ? item.customer.name : ''}));
      config = deepAssignObj(config, {show: true}, ['tableSectionsConfig', 'confiscateConfig']);
    }
  }
  const realReadonly = baseInfo.orderTag === 2 ? true : readonly;
  //当服务类型有代办及单证服务时，货物信息表单都非必填
  if (serviceTypeList.agent_operation) {
    let controls = config.goodsFormConfig.controls.map(control => ({...control, required: false}));
    config = deepAssignObj(config, {controls}, ['goodsFormConfig']);
  }
  return {
    isEdit,
    readonly: realReadonly,
    ...config,
    baseInfo, goodsDetailList, cabinetTypeList, serviceTypeList,
    confiscateList,
    globalCarModeList: await orderJobHelper.getCarModeList()
  };
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const getTaskUnitStatusTitle = (status, dic) => {
  const index = dic.findIndex(item => item.value === status);
  return index >= 0 ? dic[index].title : 'unknowStatus';
};

const getTip = ({taskUnitCode, taskUnitContent={}}) => {
  const {majorKeys=[]} = global.jobUnitConfig[taskUnitCode] || {};
  if (majorKeys.length < 1) return;
  let tip = '';
  majorKeys.map(({title, key}) => {
    const {baseInfo={}} = taskUnitContent;
    tip += `${title}：${baseInfo[key] || '未填写'}；`;
  });
  return tip;
};

/**
 * 功能：构造完整物流订单页面组件状态
 * 参数：subTitle - [可选] 基本信息子页签的标题，默认为‘订单信息’
 *       orderInfoData - [必需] 物流订单详细信息数据
 *       isEdit - [必需] 构造的物流订单页面是否为编辑页面，true为编辑订单，false为新增订单
 *       readonly - [必需] 构造的物流订单页面是否为只读页面，true为只读，false为可编辑
 *       llpId - [可选] 构造物流订单页面位置若来自商流订单，则需填写记录对应的商流订单标识
 * 返回：物流订单页面组件状态
 */
const buildCommonCompleteOrderState = async (subTitle, orderInfoData, isEdit, readonly, llpId) => {
  let index = await buildCommonOrderInfoState(orderInfoData, null, isEdit, readonly, llpId);
  if (!index) return;
  const jobStatusDic = await fetchDictionary(['task_unit_status']);
  if (jobStatusDic.returnCode !== 0) {
    showError(jobStatusDic.returnMsg);
    return;
  }
  const {taskUnitList = [], ...mainOrderInfo} = orderInfoData;
  let tabs = [{key: 'index', title: subTitle || '订单信息'}];
  let jobs = {};
  for (let item of taskUnitList) {
    const key = item.guid;
    jobs[key] = await orderJobHelper.buildJobUnitState(item, mainOrderInfo, readonly);
    if (!jobs[key]) return;
    const taskUnitStatus =  getTaskUnitStatusTitle(item.taskUnitStatus, jobStatusDic.result.task_unit_status);
    let title, tip;
    if (isEdit) {
      const orderNumber = orderInfoData.baseInfo.orderNumber;
      const newToNum = item.taskUnitNumber.substr(orderNumber.length+1);
      title = `${newToNum}(${item.taskUnitTypeName}/${taskUnitStatus})`;
      tip = getTip(item);
    }else {
      title = item.taskUnitTypeName;
    }
    tabs.push({key, title, tip});
  }
  //当有代办及单证服务作业单元时，主单货物信息全非必填
  let {...newIndex} = index;
  if (!taskUnitList.every(item => item.taskUnitCode !== 'agent_operation_agent')) {
    let {...goodsFormConfig} = newIndex.goodsFormConfig;
    goodsFormConfig.controls = goodsFormConfig.controls.map(control => ({...control, required: false}));
    newIndex.goodsFormConfig = goodsFormConfig;
  }
  return {
    readonly,
    isEdit,
    taskUnitList,
    subTitle,
    tabs,
    activeKey: 'index',
    index: newIndex,
    ...jobs
  };
};

const orderHelper = {
  completeListConfig,
  toServiceList,
  trimEmpty,
  getSaveData,
  initConfigWithData,
  check,
  onServiceChangeEx,
  onServiceConfigEx,
  getOrderInfoData,
  buildCommonOrderInfoState,
  buildCommonCompleteOrderState
};

export {
  completeListConfig,
  toServiceList,
  trimEmpty,
  getSaveData,
  initConfigWithData,
  check,
  onServiceChangeEx,
  onServiceConfigEx,
  getOrderInfoData,
  buildCommonOrderInfoState,
  buildCommonCompleteOrderState
};

export default orderHelper;
