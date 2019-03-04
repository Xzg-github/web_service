import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {ModalWithDrag, SuperTable} from '../../../../components';
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
      return 800;
    }
  };

  getProps = () => {
    const {title, onOk, onCancel} = this.props;
    return {
      title: '订购记录',
      onOk: onOk.bind(null, this.props),
      onCancel: onCancel.bind(null, this.props),
      width: this.getWidth(),
      visible: true,
      maskClosable: false,
      okText: '确定',
      cancelText: '取消'
    };
  };

  toTable = () => {
    const {tableCols, tableItems} = this.props;
    const props = {
      cols: tableCols,
      items: tableItems
    };
    return <SuperTable {...props} />
  };

  render() {
    return (
      <div className={s.root}>
        <ModalWithDrag {...this.getProps()}>
          {this.toTable()}
        </ModalWithDrag>
      </div>
    );
  }
}

export default withStyles(s)(AddDialog);
