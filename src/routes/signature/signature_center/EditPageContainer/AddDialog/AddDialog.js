import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { getObject } from '../../../../../common/common';
import {SuperTable, ModalWithDrag} from '../../../../../components';
import { Input } from 'antd';
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


  toSearchInput = () => {
    const {formValue,onChange,title} = this.props;
    const props = {
      placeholder: title === '从联系人中添加' ? '请输入姓名、账号搜索': '请输入签署群组名称进行搜索',
      style: { width: '100%', marginBottom: '10px' },
      value: formValue,
      onChange: onChange,
    };
    return <Input {...props} />;
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
      title,
      onOk: onOk.bind(null, this.props),
      onCancel: onCancel.bind(null, this.props),
      width: this.getWidth(),
      visible: true,
      maskClosable: false,
      okText: '确定',
      cancelText: '取消'
    };
  };

  render() {
    return (
      <div className={s.root}>
        <ModalWithDrag {...this.getProps()}>
          {this.toSearchInput()}
          {this.toTable()}
        </ModalWithDrag>
      </div>
    );
  }
}

export default withStyles(s)(AddDialog);
