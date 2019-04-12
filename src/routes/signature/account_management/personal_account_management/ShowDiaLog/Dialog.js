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
    const {width,isLook} = this.props;
    const props = {
      title: this.props.title,
      visible: this.props.visible,
      maskClosable: false,
      width: width ? width : 450,
      onOk: this.onClick.bind(null, 'ok'),
      onCancel: this.onClick.bind(null, 'close'),
      afterClose: this.props.afterClose
    };
    if(!isLook){
      props.footer = null;
    }
    return props
  };

  formProps = () => {
    const {isLook} = this.props;
    return {
      colNum: 1,
      readonly:!isLook,
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
    return (
      <ModalWithDrag {...this.modalProps()}>
        <SuperForm {...this.formProps()} />
      </ModalWithDrag>
    );
  }
}

export default SetDialog;
