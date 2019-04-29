import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './EditPage.less';
import {SuperTable2, SuperForm, Card, Title, SuperToolbar} from '../../../../components/index';
import {getObject} from "../../../../common/common";
import { Alert } from 'antd';


const TOOLBAR_EVENTS = ['onClick']; // 工具栏点击事件

class EditPage extends React.Component {

  toAlert = () => {
    return (
      <div style ={{overflow: 'hidden'}}>
        <div style={{float: 'left', width: '597px', marginRight: '10px'}}>
          <Alert
            message="电子签名不适用以下文书："
            type="warning"
            showIcon
            description="1、涉及婚姻、继承、收养等人身关系的;
                        2、涉及土地、房屋等不动产权益转让的;
                        3、涉及停止供水、供热、供气、供电等公共事业服务的;
                        4、法律、行政法规规定的不适用电子文书的其他形式。"/>
        </div>
        <div style={{float: 'left', width: '497px'}}>
          <Alert
            message="上传文件须知："
            type="warning"
            showIcon
            description="1.仅支持 .doc 、.docx 、.pdf 、.xls、 .xlsx格式；
                        2.文件大小需<20MB（注：上传.xls、.xlsx文档请先用Office预览，确保内容不超过A4纸范围）"/>
        </div>
      </div>
    )
  };

  toButtons1 = (buttons) => {
    const {buttons1} = this.props;
    const props = { buttons: buttons1,size: 'default', callback: getObject(this.props, TOOLBAR_EVENTS )};
    return <SuperToolbar {...props}/>
  };

/*  toShowFile = () => {
    const {value} = this.props;
    return (
      <div>
        <a href={value.urlOfSignedFileViewpdf} style={{fontSize: '14px'}}>{value.signFileSubject}</a>
      </div>
    )
  };*/

  toUpload = () => {
    const {value, buttons1} = this.props;
    const delbuttons = [{key: 'delFile', title: '删除'}];
    const props = { buttons: buttons1,size: 'default', callback: getObject(this.props, TOOLBAR_EVENTS )};
    const props1 = { buttons: delbuttons,size: 'small', callback: getObject(this.props, TOOLBAR_EVENTS )};
    if(value.signContractId){
      return(
        <div style={{overflow: 'hidden'}}>
          <div style={{float: 'left'}}>
            <SuperToolbar {...props}/>
          </div>
          <div style={{float: 'left', marginLeft: '30px'}}>
            <a href={value.urlOfSignedFileViewpdf} target="_blank">{value.signFileSubject}</a>
            <SuperToolbar {...props1}/>
          </div>
        </div>
      )
    }else{
      return (
        <SuperToolbar {...props}/>
      )
    }
  };



  toButtons2 = (buttons) => {
    const {buttons2} = this.props;
    const props = {buttons: buttons2,size: 'small', callback: getObject(this.props, TOOLBAR_EVENTS )};
    return <SuperToolbar {...props}/>
  };

  toButtons4 = (buttons) => {
    const {buttons2} = this.props;
    const props = {buttons: buttons2,size: 'small', callback: getObject(this.props, TOOLBAR_EVENTS )};
    return <div style={{}}><SuperToolbar {...props}/></div>
  };

  toButtons3 = (buttons) => {
    const {buttons3,value, buttons4} = this.props;
    const props = {buttons: buttons3, size: 'default', callback: getObject(this.props, TOOLBAR_EVENTS )};
    const props1 = {buttons: buttons4, size: 'default', callback: getObject(this.props, TOOLBAR_EVENTS )};
    if(value.signWay === 0 || value.signWay === '0'){
      return <div style={{textAlign: 'center'}}><SuperToolbar {...props1}/></div>
    }else{
      return <div style={{textAlign: 'center'}}><SuperToolbar {...props}/></div>
    }
  };

/*  getReadonly = (readonly) => {
    const {value, cascade} = this.props;
    return helper.getReadonlyKeys(cascade, value, readonly)
  };*/

  toForm1 = () => {
    const {controls1, onChange, value, onExitValid, valid, edit} = this.props;
    if(value.signContractId){
      controls1[0].type = 'text'
    }
    const props = {controls: controls1,
      value,
      onChange,
      onExitValid,
      valid,
    };
    return <SuperForm {...props} />
  };

  toForm2 = () => {
    const {controls2, onChange, value, onExitValid, valid} = this.props;
    const props = {controls: controls2, onChange, value, onExitValid, valid};
    return <SuperForm {...props} />
  };

  toTable = () => {
    const {tableCols, value, onExitValid, valid} = this.props;
    const {onContentChange, onCheck} = getObject(this.props, ['onContentChange', 'onCheck']);
    const events1 = { onContentChange, onCheck, onExitValid };
    const props = {cols: tableCols, items: value.signPartyList || [], callback: events1, valid};
    return <SuperTable2 {...props}/>
  };

  toCopy = () => {
    const {tableCols, value, onExitValid, valid} = this.props;
    const {onContentChange, onCheck} = getObject(this.props, ['onContentChange', 'onCheck']);
    const events1 = { onContentChange, onCheck, onExitValid };
    const props2 = {cols: tableCols, items: [], callback: events1, valid};
    if(value.isAddCcSide === '1' || value.isAddCcSide === 1){
      return (
        <div>
          <Title title="添加抄送方（只查看，不用签署）"/>
          {this.toButtons4()}
          <SuperTable2 {...props2}/>
        </div>
      )
    }
  };

  render(){
    return (
      <Card className = {s.root}>
        {this.toAlert()}
        <Title title = "上传文件" />
        {this.toUpload()}
        <Title title = "文件信息" />
        {this.toForm1()}
        <Title title = "签署方信息" />
        {this.toForm2()}
        <Title title = "添加签署方" />
        {this.toButtons2()}
        {this.toTable()}
        {this.toCopy()}
        {this.toButtons3()}
      </Card>
    )
  }
}

export default withStyles(s)(EditPage);
