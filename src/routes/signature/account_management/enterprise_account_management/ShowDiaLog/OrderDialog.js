import React, {PropTypes} from 'react';
import {ModalWithDrag,SuperTable,Title} from '../../../../../components';
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
    onExitValid: PropTypes.func,
    validForm:PropTypes.bool
  };

  onClick = (key) => {
    this.props.onClick(key);
  };

  modalProps = () => {
    return {
      title: this.props.title,
      visible: this.props.visible,
      maskClosable: false,
      width: 650,
      onOk: this.onClick.bind(null, 'ok'),
      onCancel: this.onClick.bind(null, 'close'),
      afterClose: this.props.afterClose
    };
  };

  tableProps = () => {
    const {cols, items, sortInfo, filterInfo,hasUnreadTable} = this.props;
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
        <Title title="套餐列表"/>
        <SuperTable {...this.tableProps()} />
        <div style={{marginTop:10}}>
          <SuperForm {...this.formProps()} />
          {this.props.validForm ? <p style={{marginTop:5,fontSize:12,color:'#f04134'}}>未匹配到套餐，请重新输入</p> : null}
        </div>
      </ModalWithDrag>
    );
  }
}

export default SetDialog;
