import React, {PropTypes} from 'react';
import {ModalWithDrag,Title} from '../../../../../components';
import SuperForm from '../../../../../components/SuperForm'
import {Alert} from 'antd'

class SetDialog extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    visible: PropTypes.bool,
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
      width: 550,
      onOk: this.onClick.bind(null, 'ok'),
      onCancel: this.onClick.bind(null, 'close'),
      afterClose: this.props.afterClose
    };
  };

  formProps = (key) => {
    return {
      colNum: 2,
      controls: this.props.controls[key],
      value: this.props.value,
      valid: this.props.valid,
      options: this.props.options,
      onChange: this.props.onChange,
      onExitValid: this.props.onExitValid,
      onClick:this.props.onClick
    };
  };

  toAlert = () => {
    const msg = [
      '发票说明：',
      '1、开票内容为“服务费”；',
      '2、发票金额满300元（含300元）包邮，未满300元将使用快递到付；',
      '3、到付费用由快递公司收取，如需快递费用发票，请向快递公司索取；',
      '4、您申请的发票将在7个工作日（不包括周末、法定节假日）内寄出。'
    ];

    const messageStr = (str) => {
      return (<p>{msg.map((it, i) => (<span key={i}>{it}<br/></span>))}</p>)

    };
    const props = {
      type:'warning',
      message:messageStr(),
      closable:false,
      showIcon:false,
    };
    return (
      <Alert {...props}/>
    );
  };

  render() {
    const {value} = this.props;
    let key = value.a === '1' ? 'two_1'  : 'two_2';
    return (
      <ModalWithDrag {...this.modalProps()}>
        <div style={{marginBottom:10}}>
          {this.toAlert()}
        </div>
        <SuperForm {...this.formProps('one')} />
        <Title title="发票信息"/>
        <SuperForm {...this.formProps(key)} />
        <Title title="收件人信息"/>
        <SuperForm {...this.formProps('three')} />
      </ModalWithDrag>
    );
  }
}

export default SetDialog;
