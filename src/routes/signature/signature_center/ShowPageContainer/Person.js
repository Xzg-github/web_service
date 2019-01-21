import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Person.less';
import showPopup from '../../../../standard-business/showPopup';
import execWithLoading from '../../../../standard-business/execWithLoading';
import helper from '../../../../common/common';
import ModalWithDrag from "../../../../components/ModalWithDrag";
import Title from "../../../../components/Title"
import SuperTable from "../../../../components/SuperTable"
import { Collapse } from 'antd';
import SuperSteps from './SuperSteps';

const Panel = Collapse.Panel;

const LABELS = [
  {key: 'fileLink', title: '文件链接'},
  {key: 'fileTheme', title: '文件主题'},
  {key: 'status', title: '状态'},
  {key: 'insertTimeStart', title: '发起时间'},
  {key: 'insertTimeEnd', title: '截至签署日期'},
  {key: 'remarks', title: '备注'},
  {key: 'annex', title: '附件'},
];

const MESSAGE = [
  {key: 'method', title: '签署方式'},
  {key: 'sequence', title: '签署顺序'},
  {key: 'position', title: '指定签署位置'},
  {key: 'copy', title: '添加抄送方'},
  {key: 'copyMessage', title: '抄送放信息'}
];

class Person extends React.Component {
  state = {visible: true};


  getProps = () => {
    const {title, showConfig, onOk, onCancel} = this.props;
    return {
      title: '签署详情',
      onOk: onOk.bind(null, this.props),
      onCancel: onCancel.bind(null, this.props),
      width: 1000,
      visible: true,
      maskClosable: false,
      cancelText: '撤销'
    };
  };

  toTable = () => {
    const {tableCols, tableItems, onLink} = this.props;
    const props = {cols: tableCols,
                  items: [],
               callback: { onLink: onLink ? onLink.bind(null) : undefined}
    };
    return <SuperTable {...props} />
  };

  toPanel = ({key, title}) => {
    const {pageReadonly, isDialog} = this.props;
    const props = {
      steps: this.props[key],
      direction: 'vertical',
    };
    return (
      <Panel key={key} header={'签署文件操作记录'}>
        {this.props[key] ? <SuperSteps {...props} /> : (<div>暂无任务单跟踪信息</div>)}
      </Panel>
    );
  };

  toShow = () => {
    const {id, value, onChange, panels} = this.props;
    const props = onChange ? {activeKey, onChange} : {defaultActiveKey: activeKey};
    return (
      <Collapse accordion {...props}>
        {panels.map(this.toPanel)}
      </Collapse>
    )
  };

  toEmpty = () => {
    return <div>暂无任何文件操作记录</div>;
  };

  render() {
    const data = this.props.data;
    const {panels = []} = this.props;
    return (
      <ModalWithDrag {...this.getProps()}>
        <Title title = "文件信息" />
        <div>{LABELS.map((item, index) => <div key={index}>{`${item.title}:`}</div>)}</div>

        <Title title = "签署信息"/>
        <div>{MESSAGE.map((item, index) => <div key={index}>{`${item.title}:`}</div>)}</div>

        <Title title = "签署记录" />
        {this.toTable()}
        <Title title = "操作记录" />
        {panels.length > 0 ? this.toShow() : this.toEmpty()}
      </ModalWithDrag>
    );
  }
}

/*const showDetails = () => {
  execWithLoading(async () => {
    const url = '/api/login/person';
    const json = await helper.fetchJson(url);
    if (json.returnCode === 0) {
      showPopup(withStyles(s)(Details), {data: json.result});
    } else {
      helper.showError(json.returnMsg);
    }
  });
};*/

export default Person;
