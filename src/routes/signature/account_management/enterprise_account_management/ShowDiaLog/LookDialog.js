import React, {PropTypes} from 'react';
import {ModalWithDrag} from '../../../../../components';
import {SuperForm,Title,SuperTable} from '../../../../../components'
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './LookDialog.less';
import {Button} from 'antd'


class LookDialog extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    visible: PropTypes.bool,
    controls: PropTypes.array,
    tableCols1: PropTypes.array,
    tableCols2: PropTypes.array,
    value: PropTypes.object,
    onClick: PropTypes.func,
    onCancel: PropTypes.func,
    onExport: PropTypes.func
  };

  footer = (onCancel,onExport) => {
    return (
      <div style={{ textAlign: 'center' }}>
        <Button size='small' onClick={() => onCancel()}>取消</Button>
        <Button size='small' onClick={() => onExport()}>导出明细</Button>
      </div>
    )
  };

  modalProps = () => {
    const { onCancel,onExport} = this.props;
    return {
      title: this.props.title,
      visible: this.props.visible,
      maskClosable: false,
      width: 800,
      onCancel,
      afterClose: this.props.afterClose,
      className: s.root ,
      footer:this.footer(onCancel,onExport)
    };
  };

  formProps = () => {
    return {
      colNum: 2,
      controls: this.props.controls,
      value: this.props.value
    };
  };

  toTable1 = () => {
    const {cols1, tableItems1=[]} = this.props;
    const props = {
      cols: cols1,
      items: tableItems1,
      maxHeight: `calc(100vh - 496px)`
    };
    return <SuperTable {...props}/>;
  };


  toFooter = (tableItems2,items) => {
    const {onMore} = this.props;
    const isMore = tableItems2.length === items.length
    return (
      <div>
        {!isMore && <span style={{ color:'#40a9ff',marginLeft:335,marginRight:150}} onClick={onMore}>点击加载更多</span>}
        <span >共有{items.length}条记录，目前展示{tableItems2.length}条</span>
      </div>
    )
  };


  toTable2 = () => {
    const {cols2, tableItems2=[],items} = this.props;
    const props = {
      cols: cols2,
      items: tableItems2,
       footer:() => this.toFooter(tableItems2, items)
    };
    return <SuperTable {...props}/>;
  };

  render() {
    return (
      <ModalWithDrag {...this.modalProps()}>
        <Title title="基本信息"/>
        <SuperForm {...this.formProps()} />
        <Title title="消费统计"/>
        {this.toTable1()}
        <Title title="消费明细"/>
        {this.toTable2()}
      </ModalWithDrag>
    );
  }
}


export default withStyles(s)(LookDialog);
