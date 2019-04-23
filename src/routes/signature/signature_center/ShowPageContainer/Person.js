import React from 'react';
/*import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Person.less';
import showPopup from '../../../../standard-business/showPopup';
import execWithLoading from '../../../../standard-business/execWithLoading';
import helper from '../../../../common/common';*/
import ModalWithDrag from "../../../../components/ModalWithDrag";
import Title from "../../../../components/Title"
import SuperTable from "../../../../components/SuperTable"
import { Collapse, Button } from 'antd';
import SuperSteps from './SuperSteps';

const Panel = Collapse.Panel;

const LABELS = [
  {key: 'urlOfSignedFileViewpdf', title: '文件链接', link: true},
  {key: 'fileState', title: '状态', type: 'select'},
  {key: 'rejectReason', title: '拒签原因'},
  {key: 'revokeReason', title: '撤销原因'},
  {key: 'note', title: '备注'},
  {key: 'signFileSubject', title: '文件主题'},
  {key: 'signStartTime', title: '发起时间'},
  {key: 'signExpirationTime', title: '截至签署日期'},
  //{key: 'annex', title: '附件'},
];

const MESSAGE = [
  {key: 'signWay', title: '签署方式', link: true},
  {key: 'signOrderStrategy', title: '签署顺序', type: 'select'},
  {key: 'isAddCcSide', title: '添加抄送方', value: '1'},
  {key: 'isSignInSpecifiedLocation', title: '指定签署位置'},
 // {key: 'copyMessage', title: '抄送放信息'}
];

class Person extends React.Component {
  state = {visible: true};

  getFooter = (config, cancel, reject) => {
    return [
     // <Button key='1' size='large' onClick={cancel}>{config.onCancel}</Button>,
      <Button key='2' size='large' onClick={reject}>{config.reject}</Button>,
    ];
  };

  getProps = () => {
    const {title, onCancel, footer, reject ,value, user} = this.props;
    const userId = user.result.userId;
    const extra =  {};
    footer.reject && (extra.footer=value.fileState === 'wait' && value.insertUser === userId ? this.getFooter(footer, onCancel, reject) : '');
    //footer.reject && (extra.footer=this.getFooter(footer, onCancel, reject));
    return {
      title,
      reject: reject.bind(null, this.props),
      onCancel: onCancel.bind(null, this.props),
      width: 1000,
      visible: true,
      maskClosable: false,
      ...extra
    };
  };

  toTable = () => {
    const {tableCols, value, onLink} = this.props;
    const props = {cols: tableCols,
                  items: value.signPartyList || [],
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

  rendValue = (item, index) => {
    const {value} = this.props;
    const state = value.fileState;
    let show;
    if(state === 'completed'){
      show = '已完成'
    }else if(state === 'draft'){
      show = '草稿'
    }else if(state === 'wait'){
      show = '待签署'
    }else if(state === 'reject'){
      show = '已拒签'
    }
    else{
      show = '已签署'
    }
    if(item.link){
      return <div key = {index}><a href={value.urlOfSignedFileViewpdf} target="_blank">在线预览</a></div>
    }else if(item.type){
      return <div key = {index}>{show}</div>
    }else{
      return <div key={index}>{value[item.key] || '无'}</div>
    }
  };

  rendValue1 = (item, index) => {
    const {value} = this.props;
    let show1, show2, show3, show4;
    if(value.signWay === '1'){
      show1 = '签署文件（每人都需签署）'
    }else if(value.signWay === '0'){
      show1 = '发送文件（仅需对方签署）'
    }else{
      show1 = '无'
    }
    if(value.signOrderStrategy === 0){
      show2 = '无序签署'
    }else if(value.signOrderStrategy === 1){
      show2 = '顺序签署'
    }else{
      show2 = '无'
    }
    if(value.isAddCcSide === '0'){
      show3 = '否'
    }else{
      show3 = '是'
    }
    if(value.isSignInSpecifiedLocation === '0'){
      show4 = '否'
    }else{
      show4 = '是'
    }
    if(item.link){
      return <div key = {index}>{show1}</div>
    }else if(item.type){
      return <div key = {index}>{show2}</div>
    }else if(item.value){
      return <div key ={index}>{show3}</div>
    }else{
      return <div key = {index}>{show4}</div>
    }
  };

  toEmpty = () => {
    return <div>暂无任何文件操作记录</div>;
  };

  render() {
    const data = this.props.data;
    const {panels = [], value} = this.props;
    return (
      <ModalWithDrag {...this.getProps()}>
        <Title title = "文件信息" />
        <div style={{overflow: 'hidden'}}>
          <div style={{float: 'left', marginRight: '6px', textAlign: 'right'}}>{LABELS.map((item, index) => <div key={index}>{`${item.title}:`}</div>)}</div>
          <div style={{float: 'left'}}>{LABELS.map((item, index)=> this.rendValue(item, index))}</div>
        </div>
        <Title title = "签署信息"/>
        <div style={{overflow: 'hidden'}}>
          <div style={{float: 'left', marginRight: '6px', textAlign: 'right'}}>{MESSAGE.map((item, index) => <div key={index}>{`${item.title}:`}</div>)}</div>
          <div style={{float: 'left'}}>{MESSAGE.map((item, index)=> this.rendValue1(item, index))}</div>
        </div>
        <Title title = "签署记录" />
        {this.toTable()}
{/*        <Title title = "操作记录" />
        {panels.length > 0 ? this.toShow() : this.toEmpty()}*/}
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
