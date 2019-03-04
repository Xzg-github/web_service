import React, {PropTypes} from 'react';
import {ModalWithDrag, Title} from '../../../../components';
import {Card} from 'antd';

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

  modalProps = () => {
    return {
      title: this.props.title,
      visible: this.props.visible,
      maskClosable: false,
      width: 600,
      onOk: this.onClick.bind(null, 'ok'),
      onCancel: this.onClick.bind(null, 'close'),
      onRefuse: this.onClick.bind(null, 'refuse'),
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
    const url = 'http://img.mp.itc.cn/upload/20160906/9ef83821c2ae4d31b4341553f9d88a7f_th.jpg';
    const {items} = this.props;
    return (
      <ModalWithDrag {...this.modalProps()}>
        <Title title="审核信息"/>
        <div style={{overflow: 'hidden'}}>
          <div style={{float: 'left'}}>{MESSAGE.map((item, index) => <div key={index}>{`${item.title}:`}</div>)}</div>
          <div style={{float: 'left'}}>{MESSAGE.map((item, index)=><div key={index} data-no={!items[item.key]}>{items[item.key] || '无'}</div>)}</div>
        </div>
        <Title title="身份证信息"/>
        <div>
          <div>
            <div>身份证正面</div>
            <img src={url}/>
          </div>
          <div>
            <div>身份证反面</div>
            <img src={url}/>
          </div>
        </div>
      </ModalWithDrag>
    );
  }
}

export default SetDialog;
