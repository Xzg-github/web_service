import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './FourthPage.less';
import {Card,SuperToolbar} from '../../../../../components/index';
import {Icon} from 'antd'





class OrderPage extends React.Component {

  constructor(props) {
    super(props);
  }


  tuButton = () => {
    const {onClick} = this.props;
    const buttons = [
      {key:'show',title:'查看证书'}
    ];
    const propsObj = {
      size: 'large',
      buttons,
      onClick
    };
    return <SuperToolbar {...propsObj}/>;
  };


  render() {

    return (
      <div className={s.root}>
        <Card>
          <div className={s.container}>
            <Icon type="check-circle"  style={{fontSize:36,color:'#2196F3'}}/>
            <p>恭喜您，企业认证已通过！</p>
            <p>云恋已为您向CA机构成功申请一张数字签名证书，您可以在云恋ePLD平台放心的进行签名了。您的企业在云恋签署的合同一单发生纠纷，可申请司法鉴定报告，一键仲裁等法律保障服务！</p>
            {this.tuButton()}
          </div>
        </Card>
      </div>
    );
  };
}

export default withStyles(s)(OrderPage);
