import {connect} from 'react-redux';
import {EnhanceLoading} from '../../components/Enhance';
import helper from '../../common/common';
import {Action} from '../../action-reducer/action';
import {getPathValue} from '../../action-reducer/helper';
import {PO_ITEMS} from './todo/TodoForPO';
import {LO_ITEMS} from './todo/TodoForLO';
import Home from './Home';
import moment from 'moment';

const STATE_PATH = ['home'];
const action = new Action(STATE_PATH);
const TODO_URL = '/api/home/todo';
const CHART_URL = '/api/home/chart';
const PRODUCT_TYPE_CUSTOM_URL = '/api/basic/tenantProduct/product_type_list';

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const buildTodoList = (items, privilege) => {
  return items.map(item => {
    const disabled = !privilege[item.key];
    if (!disabled && item.menus) {
      const menus = item.menus.filter(({key}) => privilege[key]);
      if (!menus.length) {
        return Object.assign({}, item, {disabled: true, menus: undefined});
      } else {
        return Object.assign({}, item, {disabled, menus});
      }
    } else {
      return Object.assign({}, item, {disabled});
    }
  });
};

const buildChart = (items, m) => {
  const table = items.reduce((result, item) => {
    result[item.day] = item.total;
    return result;
  }, {});

  const current = moment();
  let days = m.daysInMonth();
  let chart = [];

  if ((current.year() === m.year()) && (current.month() === m.month())) {
    days = current.date();
  }

  for (let i = 1; i <= days; i++) {
    chart.push({x: i, y: table[i] || 0});
  }

  return chart;
};

const setCount = (items, count) => {
  return items.map(item => {
    const itemCount = count[item.key];
    if (item.menus) {
      if (!itemCount || typeof itemCount !== 'object' || !itemCount.total) {
        return Object.assign({}, item, {count: 0, menus: undefined, href: item.menus[0].href});
      } else {
        const menus = item.menus.filter(({key}) => itemCount[key]);
        const total = menus.reduce((c, {key}) => (c + itemCount[key]), 0);
        if (menus.length === 0) {
          return Object.assign({}, item, {count: 0, menus: undefined, href: item.menus[0].href});
        } else if (menus.length === 1) {
          return Object.assign({}, item, {count: total, menus: undefined, href: menus[0].href});
        } else if (menus.length > 1 && menus.length < 5) {
          const m = menus.map(it => Object.assign(it, {count: itemCount[it.key]}));
          return Object.assign({}, item, {count: total, menus: m});
        } else {
          let pre = 0;
          const m = menus.slice(0, 3).map(it => {
            pre += itemCount[it.key];
            return Object.assign(it, {count: itemCount[it.key]})
          });
          m.push({key: 'other', title: '其他', count: total - pre, href: menus[3].href});
          return Object.assign({}, item, {count: total, menus: m});
        }
      }
    } else {
      return Object.assign({}, item, {count: itemCount || 0});
    }
  });
};

const fetchChart = (type, date) => {
  const t = !type ? 'business_order' : 'logistics_order';
  const url = `${CHART_URL}/${t}/${date}`;
  return helper.fetchJson(url);
};

/**
 * 获取租户产品serviceTypeCode对应的productTypeName，即自定义产品名称
 * @param productCustomInfos 从后台获取的租户产品列表对象
 * @returns {Object}
 */
const getProductCustomName = (productCustomInfos = []) => {
  const productCustomName = new Object();
  productCustomInfos
    .filter(item => item && item.serviceTypeCode && item.productTypeName)
    .forEach(item => productCustomName[item.serviceTypeCode] = item.productTypeName);
  return productCustomName;
};
/**
 * 设置自定义菜单显示名称
 * @param items 固有菜单数组
 * @param productCustomInfos 从后台获取的租户产品列表
 * @returns Array}
 */
const setCustomName = (items = [], productCustomInfos = []) => {
  const productCustomName = getProductCustomName(productCustomInfos);
  //将items 及 menus 平铺到数组中
  const items1 = new Array();
  items.forEach(item => {
    items1.push(item);
    if (item.menus) {
      item.menus.forEach(m => items1.push(m));
    }
  });
  //根据productType属性判断并设置自定义标题，未设置productType属性或自定义标题不存在时采用原有固定标题
  items1
    .filter(({productType}) =>
      productType && productCustomName[productType]
    )
    .forEach(item => {
      item.title = productCustomName[item.productType];
    });
  return items;
};
const initActionCreator = () => async (dispatch, getState) => {
  try {
    dispatch(action.assign({status: 'loading'}));
    const m = moment();
    const date = m.format('YYYY-MM');
    const todo = helper.getJsonResult(await helper.fetchJson(TODO_URL));
    const privilege = getPathValue(getState(), ['layout', 'privilege']);
    const productCustomInfos = helper.getJsonResult(await  helper.fetchJson(PRODUCT_TYPE_CUSTOM_URL));
    const hasPO = !!privilege.llp;
    const chartType = hasPO ? 0 : 1;
    const chartItems = helper.getJsonResult(await fetchChart(chartType, date));
    const poOrigin = hasPO ? buildTodoList(PO_ITEMS, privilege) : undefined;
    const loOrigin = setCustomName(buildTodoList(LO_ITEMS, privilege), productCustomInfos);
    const po = hasPO ? setCount(poOrigin, todo) : undefined;
    const lo = setCount(loOrigin, todo);
    const chart = buildChart(chartItems, m);
    const payload = {hasPO, poOrigin, loOrigin, po, lo, chart, date, chartType, month: m.month() + 1, status: 'page'};
    dispatch(action.create(payload));
  } catch (e) {
    helper.showError(e.message);
    dispatch(action.assign({status: 'retry'}));
  }
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const destroyActionCreator = () => {
  return action.assign({refresh: true});
};

const refreshActionCreator = () => async (dispatch, getState) => {
  try {
    const todo = helper.getJsonResult(await helper.fetchJson(TODO_URL));
    const {poOrigin, loOrigin} = getSelfState(getState());
    const po = setCount(poOrigin, todo);
    const lo = setCount(loOrigin, todo);
    dispatch(action.assign({po, lo, refresh: false}));
  } catch (e) {
    dispatch(action.assign({refresh: false}));
  }
};

const chartChangeActionCreator = (type, m) => async (dispatch) => {
  try {
    const date = m.format('YYYY-MM');
    dispatch(action.assign({date, chartType: type, loading: true}));
    const chartItems = helper.getJsonResult(await fetchChart(type, date));
    const chart = buildChart(chartItems, m);
    dispatch(action.assign({chart, loading: false, month: m.month() + 1}));
  } catch (e) {
    dispatch(action.assign({loading: false}));
    helper.showError(e.message);
  }
};

const actionCreators = {
  onInit: initActionCreator,
  onRefresh: refreshActionCreator,
  onChartChange: chartChangeActionCreator,
  onDestroy: destroyActionCreator
};

const Component = EnhanceLoading(Home);
const Container = connect(mapStateToProps, actionCreators)(Component);
export default Container;
