import React, { PropTypes } from 'react';
import {ModalWithDrag, SuperTable, Title, Indent, SuperForm} from '../../components';
import helper from '../../common/common';
import showPopup from '../../standard-business/showPopup';
import {exportExcelFunc} from '../../common/exportExcelSetting';
import {getPathValue} from "../../action-reducer/helper";
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ExportDialog.less';


class ExportDialog extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    config: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.initState(props);
    this.onHandleOk = this.onHandleOk.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.initState(nextProps);
  }

  initState = (props) => {
    this.state = {
      controls: props.controls,
      value: props.value,
      valid: false,
      visible: true
    };
  };

  async onHandleOk() {
    const {controls, value} = this.state;
    if (!helper.validValue(controls, value)) {
      this.setState({...this.state, valid: true});
      return;
    }
    const tableCols = JSON.parse(value.name).cols;
    exportExcelFunc(tableCols, this.props.tableItems);
    this.setState({...this.state, visible: false});
  };

  toBody = () => {
    const {controls, value, valid} = this.state;
    const props = {
      value, controls, valid,
      onChange: (key, newValue) => {this.setState({...this.state, value: {[key]: newValue}})},
      onExitValid: () => {this.setState({...this.state, valid: false})}
    };
    const props2 = {
      cols: value.name ? JSON.parse(value.name).cols.map(col => ({...col, hide: false})) : [],
      items: [],
      checkbox: false,
      index: false
    };
    return (
      <div className={s.root}>
        <Title title="选择模板" />
        <Indent><SuperForm {...props} /></Indent>
        {props2.cols.length > 0 && (<Title title="模板预览" />)}
        {props2.cols.length > 0 && (<Indent><SuperTable {...props2} /></Indent>)}
      </div>
    )
  };

  getProps = (title, config) => {
    return {
      title,
      onOk: this.onHandleOk,
      onCancel: () => {this.setState({...this.state, visible: false})},
      afterClose: () => {this.props.afterClose()},
      width: 900,
      visible: this.state.visible,
      maskClosable: false,
      okText: config.ok,
      cancelText: config.cancel
    };
  };

  render() {
    const {title, config} = this.props;
    return (
      <ModalWithDrag {...this.getProps(title, config)}>
        {this.toBody()}
      </ModalWithDrag>
    );
  }
}

const getTemplateList = (code) => {
  if (!code || !global.store) {
    return [];
  }else {
    const state = global.store.getState();
    const path = ['layout', 'tableColsSetting', code];
    const config = getPathValue(state, path) || {};
    const {templateList=[]} = config;
    return Array.isArray(templateList) ? templateList : [];
  }
};

/*
功能：按模板导出对话框
参数：tableItems 待导出的列表数据
      tableCols 当前列表列配置，用于生成默认模板
      code 列表标识，用于获取模板，与模板管理的code必须一致
返回：空
 */
export default async (tableItems, tableCols, code) => {
  const defaultOptions = [
    {title: '导出列表显示列', value: JSON.stringify({title: '导出列表显示列', cols: tableCols.filter(col => col.hide !== true)})},
    {title: '导出全部列', value: JSON.stringify({title: '导出全部列', cols: tableCols})}
  ];
  const allOptions = defaultOptions.concat(getTemplateList(code).map(item => {
    return {title: item.name, value: JSON.stringify({title: item.name, cols: item.cols})};
  }));
  const props = {
    title: 'excel导出',
    config: {
      ok: '确定',
      cancel: '取消'
    },
    controls: [
      {key: 'name', title: '模板名称', type: 'select', options: allOptions, required: true, span: 2}
    ],
    value: {},
    tableItems
  };
  return showPopup(withStyles(s)(ExportDialog), props, true);
};


