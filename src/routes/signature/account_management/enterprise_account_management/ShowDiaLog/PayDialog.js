import React, {PropTypes} from 'react';
import {ModalWithDrag,SuperTable,Title} from '../../../../../components';
import SuperForm from '../../../../../components/SuperForm'

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

  tableProps = () => {
    const {cols, items, sortInfo, filterInfo,hasUnreadTable} = this.props;
    console.log(items);
    return {
      hasUnreadTable,
      sortInfo,
      filterInfo,
      cols,
      items,
      checkbox:false,
      maxHeight: `calc(100vh - 300}px)`
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
    return (
      <ModalWithDrag {...this.modalProps()}>
        <SuperTable {...this.tableProps()} />
        <div style={{marginTop:10}}>
          <SuperForm {...this.formProps()} />
        </div>
      </ModalWithDrag>
    );
  }
}

export default SetDialog;
