import {postOption, getObject, swapItems, fetchJson, showError} from './common';
// import {fetchDictionary, setDictionary} from './dictionary';
import {buildTaskOrderDetailState} from './taskOrderInfo';
import excute from '../routes/track/execution/OrderPage/execute';

// const URL_PAGE_DATE = '/api/track/execution/page_date';
// const URL_DATA = '/api/track/execution/data';
// const CONFIG_UI = '/api/track/execution/config_ui';

const buildExecuteInfoState = async (guid, taskUnitCode,onExport,onTableChange,onClearFilter) => {
  // const { returnCode: dateCode, result: date, returnMsg: dateReturnMsg } = await fetchJson(`${URL_PAGE_DATE}`, postOption({ taskUnitCode }));
  // const { returnCode: uiCode, result: pageUI, returnMsg: uiReturnMsg } = await fetchJson(`${CONFIG_UI}`);
  // const { returnCode: dataCode, result: data, returnMsg: dataReturnMsg } = await fetchJson(`${URL_DATA}`, postOption({ guid }));
  // if (dateCode !== 0 || uiCode !== 0 || dataCode !== 0) {
  //   if (dateCode) showError(dateReturnMsg);
  //   if (uiCode) showError(uiReturnMsg);
  //   if (dataCode) showError(dataReturnMsg);
  //   return;
  // }
  // if (!pageUI.configList[taskUnitCode]) {
  //   showError(`找不到${taskUnitCode}作业单元的执行录入配置信息`);
  //   return;
  // }

  // const configUI = pageUI.configList[taskUnitCode];
  // const { tableSections=[], formSections=[] } = configUI;
  // formSections.map((item) => {
  //   if (item.title === '时间跟踪信息') {
  //     if (date.length) {
  //       item.controls = date;
  //     }
  //   }
  // });

  // if (configUI.names.length) {
  //   const {returnCode, returnMsg, result: dicResult } = await fetchDictionary(configUI.names);
  //   if (returnCode !== 0) {
  //     showError(returnMsg);
  //     return;
  //   }
  //   const arr = formSections.concat(tableSections).reduce((list, item) => {
  //     if (item.controls && item.controls.length) {
  //       list.push(...item.controls);
  //     }
  //     if (item.cols && item.cols.length) {
  //       list.push(...item.cols);
  //     }
  //     return list;
  //   }, []);
  //   setDictionary(arr, dicResult);
  // }

  let excuteData = await excute(undefined, undefined, {guid, taskUnitCode, orderNumber: undefined}, undefined, undefined, true, true);

  return {
    // configUI,
    // stateDate: data,
    ...excuteData,
    onExport,onTableChange,onClearFilter
  };
};

//参数 guid:任务单guid  taskUnitCode:任务单作业单元code
const buildExecuteOrderInfoState = async (guid, taskUnitCode, onTabChange = undefined,onExport,onTableChange,onClearFilter) => {
  if (!taskUnitCode) {
    const {returnCode, result, returnMsg} = await fetchJson(`/api/dispatch/do_base_info/${guid}`);
    if (returnCode !== 0 || !result.taskUnitCode) {
      showError(`taskUnitCode is null : ${returnMsg}`);
      return;
    }
    taskUnitCode = result.taskUnitCode;
  }
  let tabs, executeInfo, taskOrderInfo;
  executeInfo = await buildExecuteInfoState(guid, taskUnitCode,onExport,onTableChange,onClearFilter);
  if (!executeInfo) return;
  taskOrderInfo = await buildTaskOrderDetailState(guid);
  if (!taskOrderInfo) return;
  tabs = [
    {key: 'executeInfo', title: '操作信息录入'},
    {key: 'taskOrderInfo', title: '委托信息'}
  ];
  return {
    tabs,
    activeKey: onTabChange ? 'executeInfo' : undefined,
    onTabChange,
    executeInfo,
    taskOrderInfo,
  };
};

export {buildExecuteOrderInfoState, buildExecuteInfoState};
