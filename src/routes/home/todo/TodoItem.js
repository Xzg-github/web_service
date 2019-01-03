import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {Link} from '../../../components';
import {Icon} from 'antd';
import s from './TodoItem.less';

class TodoItem extends React.Component {
  static propTypes = {
    href: PropTypes.string,
    title: PropTypes.string,
    icon: PropTypes.string,
    count: PropTypes.number,
    menus: PropTypes.array,
    disabled: PropTypes.bool,
    rightBorder: PropTypes.bool,
    countColor: PropTypes.string
  };

  onLink = () => {
    global['__home'] = true;
  };

  toMenuItem = ({href, title, count}, index, height) => {
    const style = {height, lineHeight: `${height}px`};
    return (
      <Link key={index} to={href} style={style} onClick={this.onLink}>
        <span>{title}</span>
        <span>{count}</span>
      </Link>
    );
  };

  getMenuItemHeight = (count) => {
    const height = this.props.size === 'large' ? 150 : 100;
    return count > 4 ? height / 4 : height / count;
  };

  toMenu = (menus) => {
    const height = this.getMenuItemHeight(menus.length);
    const style = menus.length > 4 ? {} : {height: '100%'};
    return (
      <span data-role='menu' style={style}>
        {menus.map((item, index) => this.toMenuItem(item, index, height))}
      </span>
    );
  };

  toItem = () => {
    const {href, title, icon, count, disabled, countColor} = this.props;
    const countStyle = (!disabled && count && countColor) ? {color: countColor} : {};
    return (
      <Link data-role='item' to={href} disabled={disabled} onClick={this.onLink}>
        <Icon type={icon || 'picture'} />
        <span>
          <span>{title}</span>
          <span style={countStyle}>{disabled ? '┅' : count}</span>
        </span>
      </Link>
    );
  };

  getStatus = (title, disabled) => {
    if (title) {
      return disabled ? 'disabled' : 'normal';
    } else {
      return null;
    }
  };

  render() {
    const {title, disabled, menus, rightBorder=true, size} = this.props;
    const status = this.getStatus(title, disabled);
    return (
      <span className={s.root} data-status={status} data-border={rightBorder || null} data-size={(size === 'large') || null}>
        {title ? this.toItem() : null}
        {(title && !disabled && menus && menus.length) ? this.toMenu(menus) : null}
      </span>
    );
  }
}

export default withStyles(s)(TodoItem);
