import React, {PropTypes} from 'react';
import { Upload, Icon } from 'antd';
import { showError, showSuccessMsg} from '../../../../../common/common';
import {ModalWithDrag} from '../../../../../components';

const URL_UPLOAD = "/api/proxy/zuul/archiver_service/uploadfile";//上传图片的地址

class MyUpload extends React.Component {
  static propTypes = {
    path: PropTypes.string,
    title: PropTypes.string,
    config: PropTypes.object,
    onUpload: PropTypes.func,
    onDelete: PropTypes.func,
    onBack:PropTypes.func,
    onPreview:PropTypes.func,
  };
  //零时状态
  state = {
    previewVisible: false,
    previewImage: '',

  };
  componentWillMount(){
    const that=this;

    if(this.props.changeType === "编辑"){
      if(this.props.fileUrl&&JSON.parse(this.props.fileUrl).length>0) {
        that.setState({fileList:this.props.fileList});
      }}

  }



  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = (file) => {
    //console.log(file);
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  handleChange = ({ fileList,file }) =>{

    if(file.status === "uploading"){
    }else if(file.status === "error"){
      showError("上传范围在0M与5M之间 ");
      return
    }else if(file.status === "removed"){
      showSuccessMsg("同步到列表成功");
      if(this.props.changeType === "编辑"){
        this.props.onDelete( fileList.uid,this.props.changeType);
      }else{
        this.props.onDelete( file.response.result,this.props.changeType);
      }
    }else{
      showSuccessMsg("同步到列表成功");
      this.props.onUpload( file.response.result,this.props.changeType);
    }
    this.setState({ fileList,file })
  };

  render() {
    const { previewVisible, previewImage, fileList=[] } = this.state;

    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    return (
      <div className="clearfix">

        <Upload
          accept='image/*'
          action={URL_UPLOAD}
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          beforeUpload= {(file) => {
               const isLt2M = file.size / 1024 / 1024 < 5;      // 附件限制至5M
               const isLt0M = file.size > 0;      //大于0kb
               if (!isLt2M||!isLt0M) {
                   file.status="error";
                   return false;

                }
             }}
        >
          {fileList.length >= 10 ? null : uploadButton}

        </Upload>

        <ModalWithDrag visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </ModalWithDrag>
      </div>
    );
  }
}



export default MyUpload;
