import React, {PropTypes} from 'react';
import {ModalWithDrag, Search2, SuperTable} from '../../../components';

class ShareDialog extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    visible: PropTypes.bool,
    filters: PropTypes.array,
    cols: PropTypes.array,
    items: PropTypes.array,
    afterClose: PropTypes.func,
    onClick: PropTypes.func,
    onCheck: PropTypes.func
  };

  onClick = (key) => {
    this.props.onClick(key);
  };

  modalProps = () => {
    return {
      title: this.props.title,
      visible: this.props.visible,
      maskClosable: false,
      width: 750,
      onOk: this.onClick.bind(null, 'ok'),
      onCancel: this.onClick.bind(null, 'close'),
      afterClose: this.props.afterClose
    };
  };

  toolbarProps = () => {
    return {
      buttons: this.props.buttons,
      onClick: this.onClick,
      style: {
        margin: '5px 0'
      }
    };
  };

  tableProps = () => {
    return {
      cols: this.props.cols,
      items: this.props.tableItems,
      maxHeight: 'calc(100vh - 290px)',
      callback: {
        onCheck: this.props.onCheck
      }
    };
  };

  searchProps = () => {
    const {searchConfig,searchData={},onChange,onClick,filters} = this.props;
    return {
      colNum: 1,
      defaultSize: 'default',
      filters,
      config: searchConfig,
      data: searchData,
      onChange, onClick
    };
  };


  render() {
    return (
      <ModalWithDrag {...this.modalProps()}>
        <Search2 {...this.searchProps()}/>
        <div style={{marginTop:15}}>
          <SuperTable {...this.tableProps()}/>
        </div>
      </ModalWithDrag>
    );
  }
}

export default ShareDialog;
