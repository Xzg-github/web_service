import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {Card, Title} from '../../../components';
import TodoItem from './TodoItem';
import s from './TodoList.less';

const COUNT = 5;

class TodoList extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    items: PropTypes.array,
    height: PropTypes.number,
    size: PropTypes.oneOf(['small', 'large'])
  };

  toItem = (item, index) => {
    const props = {
      ...item,
      key: index,
      rightBorder: index < (COUNT - 1),
      size: this.props.size
    };
    return <TodoItem {...props} />;
  };

  toRow = (key, items) => {
    let newItems = items;
    if (items.length < COUNT) {
      [...newItems] = items;
      for (let i = items.length; i < COUNT; i++) {
        newItems.push({});
      }
    }
    return <div key={key}>{newItems.map(this.toItem)}</div>;
  };

  toRows = (items) => {
    const length = items.length;
    let result = [];
    for (let i = 0; i < length; i += COUNT) {
      result.push(this.toRow(i, items.slice(i, i + COUNT)));
    }
    return result;
  };

  render() {
    const {title, items, height} = this.props;
    const style = height ? {height} : null;
    return (
      <Card className={s.root} style={style}>
        <Title title={title} />
        {this.toRows(items)}
      </Card>
    );
  }
}

export default withStyles(s)(TodoList);
