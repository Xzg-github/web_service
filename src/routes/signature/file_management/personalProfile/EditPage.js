import React, {PropTypes} from 'react';
import {Card, Title, SuperToolbar} from '../../../../components';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './EditPage.less'

const LABELS = [
  {key: 'account', title: '注册账号'},
  {key: 'fileTheme', title: '真实姓名'},
  {key: 'status', title: '身份证号'},
  {key: 'insertTimeStart', title: '手机号码'},
  {key: 'insertTimeEnd', title: '电子邮件'},
  {key: 'remarks', title: '归属企业'},
  {key: 'annex', title: '企业编号'},
];

const LABELS1 = [
  {key: 'a', title: '注册时间'},
  {key: 'b', title: '发起认证时间'},
  {key: 'c', title: '完成认证时间'},
  {key: 'd', title: '绑定企业时间'},
  {key: 'e', title: '企业通过时间'},
  {key: 'f', title: '账号禁用时间'},
  {key: 'g', title: '账号启用时间'},
];

class EditPage extends React.Component{
  static propTypes = {
    editButton: PropTypes.array,
    onClick: PropTypes.func
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
    const url = 'http://img.mp.itc.cn/upload/20160906/9ef83821c2ae4d31b4341553f9d88a7f_th.jpg';
    return (
      <Card className={s.root}>
        <Title title="个人信息"/>
        <div>
          <div className="left">
            {LABELS.map((item, index) => <div key={index}>{`${item.title}:`}</div>)}
          </div>
          <div className="right">
            {LABELS1.map((item, index) => <div key={index}>{`${item.title}:`}</div>)}
          </div>
        </div>
        <div  className={s.business}>
          <div className={s.imgContainer} key= 'representative'>
            <p className={s.imgTitle}>身份证正面</p>
            <img className={s.img} src={url}/>
          </div>
          <div className={s.imgContainer} key= 'manager'>
            <p className={s.imgTitle}>身份证反面</p>
            <img className={s.img} src={url}/>
          </div>
        </div>
        <div className={s.footer}>{this.toButton()}</div>
      </Card>
    )
  }
}

export default withStyles(s)(EditPage);
