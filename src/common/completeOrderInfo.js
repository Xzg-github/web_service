import {postOption, getObject, swapItems, fetchJson, showError} from './common';
import {fetchDictionary, setDictionary} from './dictionary';
import orderHelper from './orderInfo';
import orderJobHelper from './jobUnitInfo';
const URL_ORDER_INFO = '/api/order/info';
const URL_ORDER_INFO_BY_NUMBER = '/api/order/info_by_number';

const buildCompleteOrderInfoState = async (guid, onTabChange = undefined, isGuid = true) => {
  const url = isGuid ? `${URL_ORDER_INFO}/${guid}` : `${URL_ORDER_INFO_BY_NUMBER}/${guid}`;
  const {returnCode, returnMsg, result} = await fetchJson(url);
  if (returnCode != 0) {
    showError(returnMsg);
    return;
  }
  const subTitle = `物流订单${result.baseInfo.orderNumber}`;
  const initState = await orderHelper.buildCommonCompleteOrderState(subTitle, result, true, true);
  if (!initState) return;
  return {
    ...initState,
    activeKey: onTabChange ? 'index' : undefined,
    onTabChange
  };
};

export {buildCompleteOrderInfoState};
