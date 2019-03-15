import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { getObject } from '../../../../common/common';
import {ModalWithDrag, Title, SuperForm} from '../../../../components';
import s from './AddDialog.less';

const TABLE_EVENTS = ['onCheck', 'onDoubleClick'];

class AddDialog extends React.Component {


  getProps = () => {
    const {onOk, onCancel} = this.props;
    return {
      title: '是否透支额度',
      onOk: onOk.bind(null, this.props),
      onCancel: onCancel.bind(null, this.props),
      width: '400px',
      visible: true,
      maskClosable: false,
      okText: '确定',
      cancelText: '取消',
    };
  };

  toFrom = () => {
    const {controls, value, onChange, cascade, canShow, valid} = this.props;
    const props = {
      controls: canShow ? controls.concat(cascade) : controls,
      value,
      onChange,
      valid,
      onExitValid: this.props.onExitValid,
      colNum:2
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
