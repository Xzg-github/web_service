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

  toUpload = (props, {key, title}) => {
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
  };

  toButton = () => {
    const props = {
      size: 'default',
      buttons: this.props.editButton,
      onClick: this.props.onClick.bind(null, this.props)
    };
    return <SuperToolbar {...props}/>
  };

  render() {
    const {businessTitle, managerTitle, businessInfoUpload, managerInfoUpload} = this.props;
    return (
      <Card className={s.root}>
        {this.toTitle(businessTitle)}
        <Indent>{this.toBusinessInfoForm()}</Indent>
        {businessInfoUpload.map(item => this.toUpload(this.props, item))}
        {this.toTitle(managerTitle)}
        <Indent>{this.toManagerInfoForm()}</Indent>
        {managerInfoUpload.map(item => this.toUpload(this.props, item))}
        <div className={s.footer}>{this.toButton()}</div>
      </Card>
    )
  }
}

export default withStyles(s)(EditPage);
