import React, {PropTypes} from 'react';
import {ModalWithDrag} from '../../../../../components';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './AddDialog.less';
import SuperForm from '../../enterprise_certification/components/SuperForm'

class AddDialog extends React.Component {
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
      className: s.root,
      title: this.props.title,
      visible: this.props.visible,
      maskClosable: false,
      width: 650,
      onOk: this.onClick.bind(null, 'ok'),
      onCancel: this.onClick.bind(null, 'close'),
      afterClose: this.props.afterClose
    };
  };

  formProps = () => {
    return {
      colNum: 3,
      controls: this.props.controls,
      value: this.props.value,
      valid: this.props.valid,
      options: this.props.options,
      onChange: this.props.onChange,
      onExitValid: this.props.onExitValid,
      onClick:this.props.onClick,
      onSearch:this.props.onSearch
    };
  };

  render() {
    const {imgBase} = this.props;
    return (
      <ModalWithDrag {...this.modalProps()}>
        <SuperForm {...this.formProps()} />
        <div className={s.imgDiv}>
          {imgBase && <img src={imgBase}/>}
        </div>
      </ModalWithDrag>
    );
  }
}

export default withStyles(s)(AddDialog);
