import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { getObject } from '../../../../common/common';
import {ModalWithDrag, Title, SuperForm} from '../../../../components';
import s from './AddDialog.less';

const TABLE_EVENTS = ['onCheck', 'onDoubleClick'];

class AddDialog extends React.Component {

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
    const {title, onOk, onCancel} = this.props;
    return {
      title: '是否透支额度',
      onOk: onOk.bind(null, this.props),
      onCancel: onCancel.bind(null, this.props),
      width: this.getWidth(),
      visible: true,
      maskClosable: false,
      okText: '确定',
      cancelText: '取消'
    };
  };

  toFrom = () => {
    const {controls, value, onChange} = this.props;
    const props = {
      controls,
      value,
      onChange
    };
    return <SuperForm {...props} />
  };

  render() {
    return (
      <div className={s.root}>
        <ModalWithDrag {...this.getProps()}>
          {this.toFrom()}
        </ModalWithDrag>
      </div>
    );
  }
}

export default withStyles(s)(AddDialog);
