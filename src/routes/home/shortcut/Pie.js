import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Pie.less';
import {Icon} from 'antd';
import {Link} from '../../../components';

const Pie = ({icon, title, href}) => {
  return (
    <div className={s.root}>
      <Link to={href}>
        <Icon type={icon} />
      </Link>
      <div>
        {title}
      </div>
    </div>
  );
};

export default withStyles(s)(Pie);
