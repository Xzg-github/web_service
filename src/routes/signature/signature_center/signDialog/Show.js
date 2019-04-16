import React from 'react';
import ModalWithDrag from "../../../../components/ModalWithDrag";

class Show extends React.Component {
  state = {visible: true};

  getProps = () => {
    const {title, onCancel, result} = this.props;
    return {
      title,
      onCancel: onCancel.bind(null, this.props),
      width: 1350,
      height: 800,
      visible: true,
      maskClosable: false,
      footer: false
    };
  };

  render() {
    const {result} = this.props;
    return (
      <ModalWithDrag {...this.getProps()}>
        <iframe src = {result} style={{width: '1250px', height: '700px'}} />
      </ModalWithDrag>
    );
  }
}

export default Show;
