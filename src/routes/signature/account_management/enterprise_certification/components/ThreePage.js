import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ThreePage.less';
import {Card,SuperToolbar} from '../../../../../components/index';
import {Icon} from 'antd'





class OrderPage extends React.Component {

  constructor(props) {
    super(props);
  }


  tuButton = () => {
    const {onClick} = this.props;
    const buttons = [
      {key:'previousStep',title:'上一步'},
      {key:'nextStep',title:'下一步',bsStyle:'primary'}
    ]
    const propsObj = {
      size: 'default',
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
            <p>提交成功，我们将在<span> 1 </span>个工作日完成资料审核</p>
            <div className={s.box}>
              <p>
                资料审核通过后，我们将向您的对公账号打一笔随机金额。<br/>金额到账后，您需要
              </p>
              <p>
                1.登陆您的企业网上银行，查看交易流水中该笔金额摘要信息中的随机码 (6位数字)<br/>2.回到当初认证页面填写随机码，随机码一致即完成企业认证
              </p>
              <p>
                注:打款方为"深圳市云恋科技有限公司"，因商业银行收款时间不停，一般1-3个工作日内到账，如有疑问，请咨询客服0755-88998888。
              </p>
            </div>
            {this.tuButton()}
          </div>
        </Card>
      </div>
    );
  };
}

export default withStyles(s)(OrderPage);
