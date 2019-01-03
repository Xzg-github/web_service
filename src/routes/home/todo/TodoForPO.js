import React from 'react';
import TodoList from './TodoList';

const PO_ITEMS = [
  {key: 'busf', title: '商流单创建', icon: 'pld-busf', href: '/llp/busf'},
  {key: 'book', title: '出货预约', icon: 'pld-book', href: '/llp/book', disabled: true},
  {key: 'delivery', title: '交货预约', icon: 'pld-delivery', href: '/llp/delivery'},
  {key: 'waite', title: '订单下发', icon: 'pld-waite', href: '/llp/waite'},
];

const TodoForPO = ({height, items}) => {
  return <TodoList title='商流待办' items={items} height={height} />;
};

export default TodoForPO;
export {PO_ITEMS};
