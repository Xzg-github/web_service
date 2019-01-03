import {postOption, getObject, fetchJson, showError} from './common';
import {fetchDictionary, setDictionary} from './dictionary';
import {buildJobUnitState} from './jobUnitInfo';
const URL_TASK_ORDER_INFO = '/api/dispatch/task_order_info';
const URL_CONFIG = '/api/dispatch/look_dispatch_config';


const getTaskUnitStatusTitle = (status, dic) => {
  const index = dic.findIndex(item => item.value === status);
  return index >= 0 ? dic[index].title : 'unknowStatus';
};


const buildTaskOrderDetailState = async (guid) => {
  let data, orderList;
  data = await fetchJson(URL_CONFIG);
  if(data.returnCode !== 0) {
    showError(data.returnMsg);
    return;
  }
  const {jobTitle, orderTitle} = data.result;

  data = await fetchJson(`${URL_TASK_ORDER_INFO}/${guid}`);
  if(data.returnCode !== 0) {
    showError(data.returnMsg);
    return;
  }
  orderList = data.result;
  const jobStatusDic = await fetchDictionary(['task_unit_status']);
  if (jobStatusDic.returnCode != 0) {
    showError(jobStatusDic.returnMsg);
    return;
  }
  let parts=[];
  for (let item of orderList) {
    const {taskUnitNumber, orderNumber, orderGuid, taskUnitInfo, mainOrderInfo} = item;
    const taskUnitStatus =  getTaskUnitStatusTitle(taskUnitInfo.taskUnitStatus, jobStatusDic.result.task_unit_status);
    const title = `${jobTitle}${taskUnitNumber} (${taskUnitInfo.taskUnitTypeName}/${taskUnitStatus})`;
    const jobInfoProps = await buildJobUnitState(taskUnitInfo, mainOrderInfo, true);
    if(!jobInfoProps) return;
    parts.push({title, orderTitle, orderNumber, orderGuid, jobInfoProps});
  }
  return {parts};
};

export {buildTaskOrderDetailState};
