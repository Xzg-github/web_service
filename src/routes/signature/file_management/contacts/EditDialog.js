import React, {PropTypes} from 'react';
import {ModalWithDrag, SuperForm} from '../../../../components';

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
      afterClose: this.props.afterClose
    };
  };

  formProps = () => {
    return {
      colNum: 2,
      controls: this.props.controls,
      value: this.props.value,
      valid: this.props.valid,
      options: this.props.options,
      onChange: this.props.onChange,
      onSearch:this.props.onSearch,
      onExitValid: this.props.onExitValid
    };
  };

  render() {
    return (
      <ModalWithDrag {...this.modalProps()}>
        <SuperForm {...this.formProps()} />
      </ModalWithDrag>
    );
  }
}

export default SetDialog;
