import React, { PropTypes } from 'react';
import { Button, Input, Row, Col, Upload, Icon } from 'antd';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ModeInput.less';
import {showError} from '../../common/common';
import {http} from '../../routes/llp/common/common';
import ModalWithDrag from '../ModalWithDrag';

/**
 * onCancel: 关闭窗口事件，原型func(bool) {this.setState({isShow: bool})}
 * isShow: 窗口是否展示，bool
 * modeCode: 模板类型，string
 * paramid: 记录id，string
 */

class ModeInput extends React.Component {
  static propTypes = {
    onCancel: PropTypes.func.isRequired,
    isShow:  PropTypes.bool.isRequired,
    options: PropTypes.array,
    modeCode: PropTypes.string.isRequired,
  };

  state = {
    fileList: [],
    uploading: false,
    options: [],
    msg: '',
  };

  async componentDidMount(){   // 初始化列表
    const url = '/api/config/modeinput/list';
    let mode = this.props.modeCode;
    const data = await http.get(`${url}?modelTypeCode=${mode}`);
    if(data === undefined) return;
    let items = data;
    let list = [];
    items.map((item) => {
      list.push({
        value: item.id,
        title: item.modelName,
        key: item.id
      })
    });
    this.setState({ options: list });
  }

  onCancel = () => {
    this.props.onCancel(false);
  };

  //下载
  handelDownLoad = async (value, index) => {
    let id = value;
    const url = '/api/config/modeinput/down';
    const data = await http.get(`${url}?id=${id}`);
    if(data === undefined) return;
    const linkUrl = `/api/proxy/file-center-service/${data}`;
    if(linkUrl !== '') {
      window.open(linkUrl);
    }else {
      showError('URL错误');
    }
  };


  // 删除动作回调
  onHandleRemove = (file) => {
    this.setState(({fileList}) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      return {
        fileList: newFileList,
      };
    });
  };

  // 附件上传前的操作
  beforeUpload = (file) => {
    this.setState(({fileList}) => ({
      fileList: [file],
    }));
    return false;
  };

  //上传
  handelUpLoad = async (key, index) => {
    const { fileList, msg } = this.state;
    const formData = new FormData();
    formData.append('file', fileList[0]);
    formData.append('id', key);
    const xhr = new XMLHttpRequest();
    xhr.onload = (event) =>{
      const ret = xhr.responseText; // 服务器返回
      const res = JSON.parse(ret);
      this.setState({msg: res.returnMsg});
    };
    xhr.open('post', `/api/proxy/integration_service/excelModel/importExcelContent`, true);  // true表示异步
    xhr.send(formData);

  };


  toUpload = () => {  // 上传
    const props = {
      action: `/api/proxy/integration_service/excelModelConfig/uploadExcelModel`,
      onRemove: this.onHandleRemove,
      fileList: this.state.fileList,
      beforeUpload: this.beforeUpload,
    };
    return (
      <div>
        <font size="2" style={{marginBottom: '15px'}}>1.选择模板</font>
        <div className={s.up}>
          <Upload {...props}>
            <Button style={{marginBottom: '10px'}}> <Icon type="upload" /> 选择文件 </Button>
          </Upload>
        </div>
      </div>
    );
  };


  toList = (item, index) => {
    return (
      <li key={index} className={s.list}>
        <div className={s.link}>
          <a onClick={this.handelDownLoad.bind(this, item.value, index)} >{item.title}</a>
        </div>
        <div className={s.btn}>
          <Button onClick={this.handelUpLoad.bind(this, item.key, index)}>上传</Button>
        </div>
      </li>
    )
  };


  toDownload = (options) => {
    return (
      <div>
        <div>
          <font size="2">2.下载/上传模板</font>
        </div>
        <ul>
          {
            options.map( (item, index) => this.toList(item, index))
          }
        </ul>
      </div>
    )
  };

  toTitle = () => {
    return (
      <font size="2">导入报告</font>
    )
  };

  toInput = () => {
    const { msg } = this.state;
    return <Input type="textarea" disabled autosize={{ minRows: 2, maxRows: 6 }} value={msg} />;
  };

  render() {
    return (
        <ModalWithDrag
        wrapClassName="ModeInput"
        visible={this.props.isShow}
        closable={true}
        onCancel={() => this.onCancel()}
        title='模板导入'
        width='600px'
        footer={
          null
        }
      >
        <Row>
          <Col span={11}>
            {this.toUpload()}
          </Col>
          <Col span={2}> </Col>
          <Col span={11}>{this.toDownload(this.state.options)}</Col>
        </Row>
          {this.toTitle()}
          {this.toInput()}
        </ModalWithDrag>
    );
  }
}

export default withStyles(s)(ModeInput);
