import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {Card, Title} from '../../../components';
import Pie from './Pie';
import s from './Shortcut.less';

const items = [
  {title: '客户-基本信息', icon: 'pld-client', href: '/config/client_base'},
  {title: '供应商-基本信息', icon: 'pld-supplier', href: '/config/supplier_base'},
  {title: '组织机构', icon: 'pld-institution', href: '/config/institution'},
  {title: '收发货人档案', icon: 'pld-client', href: '/config/factory'}
];

class Shortcut extends React.Component {
  static PropTypes = {
    height: PropTypes.number
  };

  toPie = (item, index) => {
    return <span key={index}><Pie {...item} /></span>;
  };

  render() {
    const {height, size} = this.props;
    const style = height ? {height} : null;
    return (
      <Card className={s.root} style={style} data-size={size === 'large' ? true : null}>
        <Title title='快捷菜单' />
        <div>
          {items.map(this.toPie)}
        </div>
      </Card>
    );
  }
}

export default withStyles(s)(Shortcut);
