import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './EditPage.less';
import {SuperTable2, SuperForm, Card, Title, SuperToolbar} from '../../../../components/index';
import {getObject} from "../../../../common/common";
import MyUploadContainer from './MyUpload/MyUploadContainer';
import { Alert } from 'antd';


const TOOLBAR_EVENTS = ['onClick']; // 工具栏点击事件

class EditPage extends React.Component {

  toAlert = () => {
    return <Alert
              message="电子签名不适用以下文书："
              type="warning"
              showIcon
              closable
              description="1、涉及婚姻、继承、收养等人身关系的;
                          2、涉及土地、房屋等不动产权益转让的;
                          3、涉及停止供水、供热、供气、供电等公共事业服务的;
                          4、法律、行政法规规定的不适用电子文书的其他形式。
                          1.仅支持 .doc 、.docx、 .wps 、.pdf 、.xls、 .xlsx格式；
                          2.文件大小需<20MB（注：上传.xls、.xlsx文档请先用Office预览，确保内容不超过A4纸范围）
                          "
    />
  };

  toButtons1 = (buttons) => {
    const {buttons1} = this.props;
    const props = { buttons: buttons1,size: 'default', callback: getObject(this.props, TOOLBAR_EVENTS )};
    return <SuperToolbar {...props}/>
  };

  toButtons2 = (buttons) => {
    const {buttons2} = this.props;
    const props = {buttons: buttons2,size: 'small', callback: getObject(this.props, TOOLBAR_EVENTS )};
    return <SuperToolbar {...props}/>
  };

  toButtons3 = (buttons) => {
    const {buttons3} = this.props;
    const props = {buttons: buttons3, size: 'default', callback: getObject(this.props, TOOLBAR_EVENTS )};
    return <SuperToolbar {...props}/>
  };

  toForm1 = () => {
    const {controls1, onChange, value} = this.props;
    const props = {controls: controls1, value, onChange};
    return <SuperForm {...props} />
  };

  toForm2 = () => {
    const {controls2, onChange, value} = this.props;
    const props = {controls: controls2, onChange, value};
    return <SuperForm {...props} />
  };

  toTable = (cols, items, callback) => {
    const {tableCols, tableItems} = this.props;
    const {onContentChange, onCheck} = getObject(this.props, ['onContentChange', 'onCheck']);
    const events1 = { onContentChange, onCheck };
    const props = {cols: tableCols, items: tableItems, callback};
    return <SuperTable2 {...props}/>
  };



  render(){
    const {tableCols, tableItems} = this.props;
    const {onContentChange, onCheck} = getObject(this.props, ['onContentChange', 'onCheck']);
    const events1 = { onContentChange, onCheck };
    return (
      <Card className = {s.root}>
        {this.toAlert()}
        <Title title = "上传文件" />
        {this.toButtons1()}
        <Title title = "文件信息" />
        {this.toForm1()}
        添加附件：<MyUploadContainer changeType={this.props.title} fileList={this.props.fileList} fileUrl={this.props.imgUrl} />
        <Title title = "签署方信息" />
        {this.toForm2()}
        <Title title = "添加签署方" />
        {this.toButtons2()}
        {this.toTable(tableCols, tableItems, events1)}
        {this.toButtons3()}
      </Card>
    )
  }
}

export default withStyles(s)(EditPage);
