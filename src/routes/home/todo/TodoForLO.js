import React from 'react';
import TodoList from './TodoList';

const planMenus = [
  {key: 'plan_mainland_native_transport', title: '国内运输', count: 12, href: '/plan/mainland_native_transport'},
  {key: 'plan_port_transport', title: '港口运输', count: 10, href: '/plan/port_transport'},
  {key: 'plan_hk_native_transport', title: '香港本地运输', count: 10, href: '/plan/hk_native_transport'},
  {key: 'plan_native_inshore_sea_shipping', title: '内贸海运', count: 4, href: '/plan/native_inshore_sea_shipping'},
];

const dispatchMenus = [
  {productType:'mainland_native_transport',key: 'mainland_native_transport', title: '国内运输', href: '/dispatch/mainland_native_transport'},
  {productType:'bonded_transport',key: 'bonded_transport', title: '保税运输', href: '/dispatch/bonded_transport'},
  {productType:'native_inshore_trade',key: 'native_inshore_trade', title: '内贸运输', href: '/dispatch/native_inshore_trade'},
  {productType:'mainland_hk_transport',key: 'mainland_hk_transport', title: '中港运输', href: '/dispatch/mainland_hk_transport'},
  {productType:'port_transport',key: 'port_transport', title: '港口运输', href: '/dispatch/port_transport'},
  {productType:'hk_native_transport',key: 'hk_native_transport', title: '香港本地运输', href: '/dispatch/hk_native_transport'},
  {productType:'sea_transport',key: 'sea_transport', title: '海运', href: '/dispatch/sea_transport'},
  {productType:'agent_booking_ship',key: 'agent_booking_ship', title: '代订舱', href: '/dispatch/agent_booking_ship'},
  {productType:'native_inshore_sea_shipping',key: 'native_inshore_sea_shipping', title: '内贸海运', href: '/dispatch/native_inshore_sea_shipping'},
  {productType:'air_transport',key: 'air_transport', title: '空运', href: '/dispatch/air_transport'},
  {productType:'express_delivery',key: 'express_delivery', title: '快递', href: '/dispatch/express_delivery'},
  {productType:'warehouse_operation',key: 'warehouse_operation', title: '仓储', href: '/dispatch/warehouse_operation'},
  {productType:'customs_service',key: 'customs_service', title: '报关', href: '/dispatch/customs_service'},
  {productType:'transform_do',key: 'transform_do', title: '转DO', href: '/dispatch/transform_do'},
  {productType:'railroad_transport',key: 'railroad_transport', title: '铁路运输', href: '/dispatch/railroad_transport'},
  {productType:'barge_transport',key: 'barge_transport', title: '驳船运输', href: '/dispatch/barge_transport'},
  {productType:'agent_operation',key: 'agent_operation', title: '代办及单证服务', href: '/dispatch/agent_operation'},
];

const executionMenus = [
  {productType: 'sea_transport',key: 'execution_sea_transport', title: '海运', href: '/track/sea_transport'},
  {productType: 'air_transport',key: 'execution_air_transport', title: '空运', href: '/track/air_transport'},
  {productType: 'express_delivery',key: 'execution_express_delivery', title: '快递', href: '/track/express_delivery'},
  {productType: 'port_transport',key: 'execution_port_transport', title: '港口运输', href: '/track/port_transport'},
  {productType: 'mainland_hk_transport',key: 'execution_mainland_hk_transport', title: '中港运输', href: '/track/mainland_hk_transport'},
  {productType: 'bonded_transport',key: 'execution_bonded_transport', title: '保税运输', href: '/track/bonded_transport'},
  {productType: 'mainland_native_transport',key: 'execution_mainland_native_transport', title: '国内公路运输', href: '/track/mainland_native_transport'},
  {productType: 'hk_native_transport',key: 'execution_hk_native_transport', title: '香港本地运输', href: '/track/hk_native_transport'},
  {productType: 'agent_booking_ship',key: 'execution_agent_booking_ship', title: '代订舱', href: '/track/agent_booking_ship'},
  {productType: 'transform_do',key: 'execution_transform_do', title: '转DO', href: '/track/transform_do'},
  {productType: 'agent_operation',key: 'execution_agent_operation', title: '代操作', href: '/track/agent_operation'},
  {productType: 'native_inshore_trade',key: 'execution_native_inshore_trade', title: '内贸运输', href: '/track/native_inshore_trade'},
  {productType: 'railroad_transport',key: 'execution_railroad_transport', title: '铁路运输', href: '/track/railroad_transport'},
  {productType: 'warehouse_operation',key: 'execution_warehouse_operation', title: '仓储', href: '/track/warehouse_operation'},
  {productType: 'native_inshore_sea_shipping',key: 'execution_native_inshore_sea_shipping', title: '内贸海运', href: '/track/native_inshore_sea_shipping'},
  {productType: 'barge_transport',key: 'execution_barge_transport', title: '驳船运输', href: '/track/barge_transport'},
];

const hmblMenus = [
  {key: 'seafreight', title: '国际海运', href: '/track/seafreight', count: 10},
  {key: 'airlift', title: '空运运输', href: '/track/airlift', count: 20},
  {key: 'railway', title: '铁路联运', href: '/track/railway', count: 120},
];

const LO_ITEMS = [
  {key: 'order_input', title: 'LO创建', icon: 'pld-input', href: '/order/input'},
  {key: 'order_split', title: '订单拆分', icon: 'pld-split', href: '/order/split'},
  {key: 'order_job', title: '信息完善', icon: 'pld-job', href: '/order/job'},
  {key: 'receive', title: '应收结算', icon: 'pld-receive', count: 40, href: '/bill/receive'},
  {key: 'plan', title: '物流计划', icon: 'pld-plan', href: '#', menus: planMenus},
  {key: 'dispatch', title: '派单', icon: 'pld-dispatch', href: '#', menus: dispatchMenus},
  {key: 'execution', title: '执行', icon: 'pld-execution', href: '#', menus: executionMenus},
  {key: 'pay', title: '应付结算', icon: 'pld-pay', href: '/bill/pay'},
  {key: 'exception', title: '异常', icon: 'pld-exception', href: '/track_manager/exception', countColor: '#fb5600'},
  {key: 'hmbl', title: '提单', icon: 'pld-bl', href: '#', menus: hmblMenus},
];

const TodoForLO = ({height, items, size}) => {
  return <TodoList title='物流待办' items={items} height={height} size={size} />;
};

export default TodoForLO;
export {LO_ITEMS};
