import React, {PropTypes} from 'react';
import {ModalWithDrag, Title} from '../../../../components';
import {Card} from 'antd';
import ReactDOM from 'react-dom';
import {Button} from 'antd';

const Meta = Card.Meta;

const MESSAGE = [
  {key: 'idNumber', title: '身份证号'},
  {key: 'realName', title: '真实姓名'},
  {key: 'notifyEmail', title: '电子邮件'},
  {key: 'notifyPhone', title: '手机号码'},
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

  getFooter = (config, ok, cancel, reject) => {
    return [
      <Button key='1' size='large' onClick={cancel}>{config.cancel}</Button>,
      <Button key='2' size='large' onClick={reject}>{config.reject}</Button>,
      <Button key='3' size='large' onClick={ok} type='primary'>{config.ok}</Button>
    ];
  };

  modalProps = () => {
    const {config, reject, ok, cancel} = this.props;
    const extra =  {};
    config.reject && (extra.footer=this.getFooter(config, ok, cancel, reject));
    return {
      title: this.props.title,
      visible: this.props.visible,
      maskClosable: false,
      width: 600,
      onOk: this.onClick.bind(null, 'ok'),
      onCancel: this.onClick.bind(null, 'cancel'),
      reject: this.onClick.bind(null, 'reject'),
      afterClose: this.props.afterClose,
      okText: config.ok,
      cancelText: config.cancel,
      ...extra
    };
  };

  idProps = () => {
    return {
      cover: this.props.cover,
      style: '350px'
    }
  };

  render() {
    const {items} = this.props;
    return (
      <ModalWithDrag {...this.modalProps()}>
        <Title title="审核信息"/>
        <div style={{overflow: 'hidden'}}>
          <div style={{float: 'left', marginRight: '6px'}}>{MESSAGE.map((item, index) => <div key={index}>{`${item.title}:`}</div>)}</div>
          <div style={{float: 'left', color: '#333'}}>{MESSAGE.map((item, index)=><div key={index} data-no={!items[item.key]}>{items[item.key] || '无'}</div>)}</div>
        </div>
        <Title title="身份证信息"/>
        <div>
          <div>
            <div></div>
          </div>
          <div>
            <div></div>
          </div>
        </div>
      </ModalWithDrag>
    );
  }
}

export default SetDialog;
