import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import {Button} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './OrderPage.less';
import {Card} from '../../../../../components/index';
import QRCode from 'qrcode.react'




class OrderPage extends React.Component {

  constructor(props) {
    super(props);
  }



  render() {
    const widowHref = window.location.href;
    let href = widowHref.split('/signature/personal_certification')[0];


    const url = `${href}/code?token=${this.props.strCookie}`;

    const codeProps = {
      value:url,
      size:128
    };
    return (
      <div className={s.root}>
        <Card noPadding={true}>
          <div className={s.box}>
            <div className={s.code}>
              <QRCode {...codeProps}/>
            </div>
            <div>
              <Button size='large' type={this.props.type} disabled={this.props.disabled} onClick={this.props.verification}>{this.props.text}</Button>
            </div>
            <p>认证失败？点击进入<span>人工审核>></span></p>
          </div>
        </Card>
      </div>
    );
  };
}

export default withStyles(s)(OrderPage);
