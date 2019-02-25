import React, {PropTypes} from 'react';
import {ModalWithDrag} from '../../../../../components';

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
      width: 550,
      onOk: this.onClick.bind(null, 'ok'),
      onCancel: this.onClick.bind(null, 'close'),
      afterClose: this.props.afterClose,
      okText:'重新认证'
    };
  };

  render() {
    return (
      <ModalWithDrag {...this.modalProps()}>
        <p>如果您的企业信息发生变更，请及时更新信息，重新提交认证。</p>
      </ModalWithDrag>
    );
  }
}

export default SetDialog;
