import React, {PropTypes} from 'react';
import {ModalWithDrag} from '../../../../../components';
import SuperForm from '../../enterprise_certification/components/SuperForm'

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
    const {width} = this.props;
    return {
      title: this.props.title,
      visible: this.props.visible,
      maskClosable: false,
      width: width ? width : 450,
      onOk: this.onClick.bind(null, 'ok'),
      onCancel: this.onClick.bind(null, 'close'),
      afterClose: this.props.afterClose
    };
  };

  formProps = () => {
    return {
      colNum: 1,
      controls: this.props.controls,
      value: this.props.value,
      valid: this.props.valid,
      options: this.props.options,
      onChange: this.props.onChange,
      onExitValid: this.props.onExitValid,
      onClick:this.props.onClick
    };
  };

  render() {
    console.log(this.props);
    return (
      <ModalWithDrag {...this.modalProps()}>
        <SuperForm {...this.formProps()} />
      </ModalWithDrag>
    );
  }
}

export default SetDialog;
