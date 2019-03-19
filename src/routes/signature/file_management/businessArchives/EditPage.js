import React, {PropTypes} from 'react';
import {Card, Title, Indent, SuperForm, SuperToolbar} from '../../../../components';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './EditPage.less';
import UploadDialog from './UploadDialog/UploadDialog';

class EditPage extends React.Component{
  static propTypes = {
    businessInfo: PropTypes.array,
    managerInfo: PropTypes.array,
    businessInfoUpload: PropTypes.array,
    managerInfoUpload: PropTypes.array,
    businessTitle: PropTypes.string,
    managerTitle: PropTypes.string,
    editButton: PropTypes.array,
    addButton: PropTypes.array,
    onClick: PropTypes.func
  };

  toTitle = (title) => {
    return <Title title={title}/>
  };

  toBusinessInfoForm = () => {
    const {businessInfo, value} = this.props;
    const formProps = {
      controls: businessInfo,
      value: value
    };
    return <SuperForm {...formProps} />
  };

  toManagerInfoForm = () => {
    const {managerInfo, value} = this.props;
    const formProps = {
      controls: managerInfo,
      value: value
    };
    return <SuperForm {...formProps} />
  };

  toManagerInfoUpload = (props, {key, title}) => {
    const {value, isLook, onUploadChange} = props;
    const UploadProps = {
      src: value[key],
      isLook,
      onChange: onUploadChange,
      title,
      UploadKey: key,
      key
    };
    return <UploadDialog {...UploadProps}/>
  }

  toButton = () => {
    const props = {
      size: 'default',
      buttons: this.props.editButton,
      onClick: this.props.onClick.bind(null, this.props)
    }
    return <SuperToolbar {...props}/>
  };

  render() {
    const {businessTitle, managerTitle, businessInfoUpload} = this.props;
    const url = 'http://img.mp.itc.cn/upload/20160906/9ef83821c2ae4d31b4341553f9d88a7f_th.jpg';
    return (
      <Card className={s.root}>
        {this.toTitle(businessTitle)}
        <Indent>{this.toBusinessInfoForm()}</Indent>
        <div className={s.business}>
          {businessInfoUpload.map(item => this.toManagerInfoUpload(this.props, item))}
        </div>
        {this.toTitle(managerTitle)}
        <Indent>{this.toManagerInfoForm()}</Indent>
        <div  className={s.business}>
          <div className={s.imgContainer} key= 'representative'>
            <p className={s.imgTitle}><span>*</span>法定代表人身份证正反面复印件</p>
            <img className={s.img} src={url}/>
          </div>
          <div className={s.imgContainer} key= 'manager'>
            <p className={s.imgTitle}><span>*</span>账号管理人身份证正反面复印件</p>
            <img className={s.img} src={url}/>
          </div>
        </div>
        <div className={s.footer}>{this.toButton()}</div>
      </Card>
    )
  }
};

export default withStyles(s)(EditPage);
