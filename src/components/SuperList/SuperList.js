import React, { PropTypes } from 'react';
import SuperListItem from './SuperListItem';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './SuperList.less';

const ItemType = {
  title: PropTypes.string.isRequired,
  children: PropTypes.arrayOf(PropTypes.string).isRequired
};

/**
 * itemIcon: 图标的url，图标大小为16x16，存在时item.children中每一项会显示一个图标
 */
const OptionType = {
  itemIcon: PropTypes.string
};

/**
 * onSelect: 条目选中时触发，原型为func(index, childIndex)
 * onIconClick：图标点击时触发，原型为func(index, childIndex)
 */
const CallbackType = {
  onSelect: PropTypes.func,
  onIconClick: PropTypes.func
};

class SuperList extends React.Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape(ItemType)).isRequired,
    option: PropTypes.shape(OptionType),
    callback: PropTypes.shape(CallbackType)
  };

  constructor(props) {
    super(props);
    this.state = {index: -1, childIndex: -1};
  }

  onSelect = (index, childIndex) => {
    const {onSelect} = this.props.callback || {};
    this.setState({index, childIndex});
    if (onSelect) {
      onSelect(index, childIndex);
    }
  };

  toListItem = (item, index) => {
    const {option} = this.props;
    let {...callback} = this.props.callback;
    let active;

    callback.onSelect = this.onSelect;
    if (this.state.index === index) {
      active = {childIndex: this.state.childIndex, className: s["item-active"]};
    }

    return <SuperListItem {...{key: index, callback, option, item, index, active}}/>;
  };

  render() {
    const {items} = this.props;
    return <div className={s.root}>{items.map((item, index) => this.toListItem(item, index))}</div>;
  }
}

export default withStyles(s)(SuperList);
