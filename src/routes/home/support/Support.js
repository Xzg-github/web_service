import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {Card, Title} from '../../../components';
import {Icon} from 'antd';
import s from './Support.less';

const Block = ({type, title, children, ...props}) => {
  return (
    <div {...props} data-role='block'>
      <div><Icon type={type} /></div>
      <div>
        <div>{title}</div>
        <div style={{fontSize: 14, fontWeight: 'bold'}}>{children}</div>
      </div>
    </div>
  );
};

class Support extends React.Component {
  render() {
    const {height} = this.props;
    const style = height ? {height} : null;
    return (
      <Card className={s.root} style={style}>
        <Title title='服务支持'/>
        <div>
          <Block type='pld-phone' title='服务热线'>
            <div>83580000 转 8719</div>
            <div>13827038393</div>
          </Block>
          <Block type='pld-QQ' title='在线客服'>
            QQ: 190601986
          </Block>
          <Block type='pld-email' title='建议反馈'>
            lizhenjie@cloudlinkscm.com
          </Block>
        </div>
      </Card>
    );
  }
}

export default withStyles(s)(Support)
