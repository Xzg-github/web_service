import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { getObject } from '../../../../common/common';
import {SuperTable, ModalWithDrag, Title, SuperTab2, SuperForm} from '../../../../components';
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

  toTabs = () => {
    const {tabs, tabActiveKey, onTabChange} = this.props;
    const props = {tabs, activeKey: tabActiveKey, onTabChange};
    return <SuperTab2 {...props}/>;
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
      return 700;
    }
  };

  formProps = () => {
    return {
      colNum: 2,
      controls: this.props.controls,
      value: this.props.value,
      valid: this.props.valid,
      options: this.props.options,
      onChange: this.props.onChange,
      onExitValid: this.props.onExitValid,
      onClick:this.props.onClick
    };
  };

  getProps = () => {
    const {title, contactConfig, onOk, onCancel, tableItems} = this.props;
    return {
      title: '订单编号',
      onOk: onOk.bind(null, this.props),
      onCancel: onCancel.bind(null, this.props),
      width: this.getWidth(),
      visible: true,
      maskClosable: false,
      okText: '确定',
      cancelText: '关闭'
    };
  };

  render() {
    return (
      <div className={s.root}>
        <ModalWithDrag {...this.getProps()}>
          <Title title="套餐列表" />
          {this.toTable()}
          <SuperForm {...this.formProps()} />
        </ModalWithDrag>
      </div>
    );
  }
}

export default withStyles(s)(AddDialog);
