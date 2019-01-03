import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Statistics from './statistics/Statistics';
import TodoForPO from './todo/TodoForPO';
import TodoForLO from './todo/TodoForLO';
import Shortcut from './shortcut/Shortcut';
import Support from './support/Support'
import s from './Home.less';

const _isNotEqual = (arr1, arr2) => {
  if (arr1.length !== arr2.length) {
    return true;
  } else {
    return arr1.some((item, index) => {
      const item2 = arr2[index];
      return (item.key !== item2.key) || (item.count !== item2.count);
    });
  }
};

const isNotEqual = (arr1, arr2) => {
  if (arr1 === arr2) {
    return false;
  }

  if (arr1.length !== arr2.length) {
    return true;
  } else {
    return arr1.some((item, index) => {
      const item2 = arr2[index];
      if ((item.key !== item2.key) || (item.count !== item2.count)) {
        return true;
      } else if (item.menus) {
        return !item2.menus ? true : _isNotEqual(item.menus, item2.menus);
      } else {
        return !!item2.menus;
      }
    });
  }
};

class Home extends React.Component {
  static propTypes = {
    hasPO: PropTypes.bool,
    po: PropTypes.array,
    lo: PropTypes.array,
    refresh: PropTypes.bool,
    onDestroy: PropTypes.func,
    onRefresh: PropTypes.func
  };

  constructor(props) {
    super(props);
    if (props.refresh) {
      props.onRefresh();
    }
  }

  componentWillUnmount() {
    const {onDestroy} = this.props;
    onDestroy && onDestroy();
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.refresh && !nextProps.refresh) {
      return isNotEqual(this.props.lo, nextProps.lo) || isNotEqual(this.props.po, nextProps.po);
    } else {
      return true;
    }
  }

  toLeft = (hasPO, po, lo) => {
    if (hasPO) {
      return (
        <div>
          <TodoForPO height={140} items={po} />
          <TodoForLO height={240} items={lo} />
          <Shortcut height={150} />
        </div>
      );
    } else {
      return (
        <div>
          <TodoForLO height={340} items={lo} size='large' />
          <Shortcut height={200} size='large' />
        </div>
      );
    }
  };

  render() {
    const {po, lo, hasPO, chart, chartType:type, date, month, loading, onChartChange} = this.props;
    return (
      <div className={s.root}>
        <div>欢迎使用ePLD供应链管理系统</div>
        <div>
          {this.toLeft(hasPO, po, lo)}
          <div>
            <Statistics height={320} items={chart} {...{hasPO, type, date, month, loading, onChartChange}} />
            <Support height={220}/>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Home);
