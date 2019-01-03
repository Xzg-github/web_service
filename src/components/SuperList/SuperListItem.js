import React, { PropTypes } from 'react';
import triRightUrl from './triangle_right.png';
import triBottomUrl from './triangle_bottom.png';

class SuperListItem extends React.Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    item: PropTypes.object.isRequired,
    callback: PropTypes.object.isRequired,
    option: PropTypes.object,
    active: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {expanded: true};
  }

  getActiveClass = (index) => {
    const {childIndex, className} = this.props.active || {};
    return childIndex === index ? className : "";
  };

  onTriangleClick = (event) => {
    this.setState({expanded: !this.state.expanded});
    event.stopPropagation();
  };

  onIconClick = (childIndex, event) => {
    const {callback, index} = this.props;
    if (callback.onIconClick) {
      callback.onIconClick(index, childIndex);
    }
    event.stopPropagation();
  };

  onItemClick = (childIndex) => {
    const {callback, index} = this.props;
    callback.onSelect(index, childIndex);
  };

  toIcon = (childIndex) => {
    const {itemIcon} = this.props.option || {};
    if (itemIcon) {
      return <img src={itemIcon} alt="icon" onClick={this.onIconClick.bind(this, childIndex)}/>
    } else {
      return null;
    }
  };

  toChild = (child, index) => {
    const onClick = this.onItemClick.bind(this, index);
    const className = this.getActiveClass(index);
    return (
      <li key={index} className={className} onClick={onClick}>
        {this.toIcon(index)}
        <span>{child}</span>
      </li>
    );
  };

  toChildren = () => {
    const {children} = this.props.item;
    return <ul>{children.map((child, index) => this.toChild(child, index))}</ul>;
  };

  render() {
    const {title} = this.props.item;
    const expanded = this.state.expanded;
    return (
      <div>
        <div className={this.getActiveClass(-1)} onClick={this.onItemClick.bind(this, -1)}>
          <span onClick={this.onTriangleClick}>
            <img src={expanded ? triBottomUrl : triRightUrl} alt="triangle"/>
          </span>
          <span>{title}</span>
        </div>
        {expanded ? this.toChildren() : null}
      </div>
    );
  }
}

export default SuperListItem;
