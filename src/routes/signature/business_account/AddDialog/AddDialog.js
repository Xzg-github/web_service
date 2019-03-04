import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { getObject } from '../../../../common/common';
import {SuperTable, ModalWithDrag, Title} from '../../../../components';
import s from './AddDialog.less';

const TABLE_EVENTS = ['onCheck', 'onDoubleClick'];

class AddDialog extends React.Component {

  toTable = () => {
    const {tableCols, tableItems, maxHeight} = this.props;
    const props = {
      cols: tableCols,
      items: tableItems,
      maxHeight,
      callback:  getObject(this.props, TABLE_EVENTS)
    };
    return <SuperTable {...props}/>
  };

  getWidth = () => {
    const {size} = this.props;
    if (size === 'small') {
      return 520;
    } else if (size === 'middle') {
      return 700;
    } else if (size === 'large') {
      return 910;
    } else {
      return 520;
    }
  };

  getProps = () => {
    const {title, contactConfig, onOk, onCancel} = this.props;
    return {
      title: '订单编号',
      onOk: onOk.bind(null, this.props),
      onCancel: onCancel.bind(null, this.props),
      width: this.getWidth(),
      visible: true,
      maskClosable: false,
      okText: '返回下单',
      cancelText: '关闭'
    };
  };

  render() {
    return (
      <div className={s.root}>
        <ModalWithDrag {...this.getProps()}>
          <Title title="套餐列表" />
          {this.toTable()}
        </ModalWithDrag>
      </div>
    );
  }
}

export default withStyles(s)(AddDialog);