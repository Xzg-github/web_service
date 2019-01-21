import React, {PropTypes} from 'react';
import {ModalWithDrag} from '../../../../../components';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './OkDialog.less';


const LABELS = [
  {key: 'qymc', title: '企业名称'},
  {key: 'yyzzzch', title: '营业执照注册号'},
  {key: 'zzjgdm', title: '组织机构代码证'},
  {key: 'dgyhzh', title: '对公银行账号'},
  {key: 'dgyhmc', title: '对公银行名称'},
  {key: 'dgyykhzh', title: '对公银行开户支行'},
  {key: 'frxm', title: '法人姓名'},
  {key: 'frsfzh', title: '法人身份证号'},
  {key: 'zhglrxm', title: '账号管理人姓名'},
  {key: 'zhglrsfzh', title: '账号管理人身份证号'},
  {key: 'zhglrsjh', title: '账号管理人手机号'},
];



class OkDialog extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    visible: PropTypes.bool,
    controls: PropTypes.array,
    value: PropTypes.object,
    valid: PropTypes.bool,
    afterClose: PropTypes.func,
    onClick: PropTypes.func,
    onChange: PropTypes.func,
    onExitValid: PropTypes.func
  };

  onClick = (key) => {
    this.props.onClick(key);
  };

  modalProps = () => {
    return {
      className: s.root,
      title: this.props.title,
      visible: this.props.visible,
      maskClosable: false,
      width: 450,
      onOk: this.onClick.bind(null, 'ok'),
      onCancel: this.onClick.bind(null, 'close'),
      afterClose: this.props.afterClose
    };
  };




  render() {
    const {value} = this.props;
    return (
      <ModalWithDrag {...this.modalProps()}>
        <div className={s.box}>
          <div>{LABELS.map((item, index) => <div key={index}>{`${item.title}:`}</div>)}</div>
          <div>{LABELS.map((item, index) => <div key={index}>{value[item.key]}</div>)}</div>
        </div>
        <p>是否确认提交的所有资料无误并提交法大大审核？</p>
      </ModalWithDrag>
    );
  }
}

export default withStyles(s)(OkDialog);
