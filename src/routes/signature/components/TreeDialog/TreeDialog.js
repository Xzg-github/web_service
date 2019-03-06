import React, {PropTypes} from 'react';
import {ModalWithDrag, SuperToolbar} from '../../../../components';
import SuperTree from './SuperTree'
import {Button} from 'antd'
import { getObject } from '../../../../common/common';

const TREE_PROPS = ['tree', 'expand', 'select','value', 'searchValue', 'onExpand', 'onSelect','onChange','onCancel','onOk','expandedKeys'];

class TreeDialog extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    visible: PropTypes.bool,
    buttons: PropTypes.array,
    afterClose: PropTypes.func,
    onClick: PropTypes.func,
    onCheck: PropTypes.func
  };

  onClick = (key) => {
    this.props.onClick(key);
  };

  getFooter = (footer) => {
    return [
      <Button key='1' size='large' onClick={this.onClick.bind(null, 'close')}>取消</Button>,
      footer && <Button key='3' size='large' onClick={this.onClick.bind(null, 'ok')} type='primary'>确认</Button>
    ];
  };


  modalProps = () => {
    return {
      title: this.props.title,
      visible: this.props.visible,
      maskClosable: false,
      width: 480,
      onOk: this.onClick.bind(null, 'ok'),
      onCancel: this.onClick.bind(null, 'close'),
      afterClose: this.props.afterClose,
      footer: this.getFooter(this.props.footer)
    };
  };


  toolbarProps = () => {
    return {
      buttons: this.props.buttons,
      onClick: this.onClick,
      style: {
        margin: '5px 0'
      }
    };
  };

  getTreeProps = () => {
    return getObject(this.props, TREE_PROPS);
  };


  render() {
    const {footer} = this.props;
    return (
      <ModalWithDrag {...this.modalProps()}>
        {!footer&&<SuperToolbar {...this.toolbarProps()} />}
        <SuperTree {...this.getTreeProps()} />
      </ModalWithDrag>
    );
  }
}

export default TreeDialog;
