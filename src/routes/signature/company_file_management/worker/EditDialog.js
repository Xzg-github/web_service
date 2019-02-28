import React, {PropTypes} from 'react';
import {ModalWithDrag, Title} from '../../../../components';
import {Card} from 'antd';

const Meta = Card.Meta;

const MESSAGE = [
  {key: 'account', title: '注册账号'},
  {key: 'name', title: '真实姓名'},
  {key: 'id', title: '身份证号'},
  {key: 'email', title: '电子邮件'},
  {key: 'number', title: '手机号码'},
];

class SetDialog extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    visible: PropTypes.bool,
    controls: PropTypes.array,
    value: PropTypes.object,
    valid: PropTypes.bool,
    afterClose: PropTypes.func,
    onClick: PropTypes.func,
    onChange: PropTypes.func,
    onExitValid: PropTypes.func
  };

  onClick = (key) => {
    this.props.onClick(key);
  };

  modalProps = () => {
    return {
      title: this.props.title,
      visible: this.props.visible,
      maskClosable: false,
      width: 600,
      onOk: this.onClick.bind(null, 'ok'),
      onCancel: this.onClick.bind(null, 'close'),
      afterClose: this.props.afterClose
    };
  };

  idProps = () => {
    return {
      cover: this.props.cover,
      style: '350px'
    }
  };


  render() {
    return (
      <ModalWithDrag {...this.modalProps()}>
        <Title title="审核信息"/>
        <div>{MESSAGE.map((item, index) => <div key={index}>{`${item.title}:`}</div>)}</div>
      </ModalWithDrag>
    );
  }
}

export default SetDialog;
