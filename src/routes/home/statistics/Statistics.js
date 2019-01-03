import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {Card, Title} from '../../../components';
import {DatePicker, Icon, Dropdown, Menu, Spin} from 'antd';
import Chart from './Chart';
import moment from 'moment';
import s from './Statistics.less';
const MonthPicker = DatePicker.MonthPicker;
const MenuItem = Menu.Item;
const MENU_ITEMS = [
  '商流订单',
  '物流订单'
];

class Statistics extends React.Component {
  static propTypes = {
    hasPO: PropTypes.bool,
    items: PropTypes.array,
    type: PropTypes.number,
    date: PropTypes.string,
    month: PropTypes.number,
    height: PropTypes.number,
    onChartChange: PropTypes.func
  };

  onChange = (m) => {
    const {onChartChange, type} = this.props;
    onChartChange && onChartChange(type, m);
  };

  onMenuClick = ({key}) => {
    const index = Number(key);
    if (index !== this.props.type) {
      const {onChartChange, date} = this.props;
      onChartChange && onChartChange(index, moment(date));
    }
  };

  toChart = (month, items) => {
    return <Chart data={items} month={month} />;
  };

  toMenu = () => {
    return (
      <Menu onClick={this.onMenuClick}>
        {MENU_ITEMS.map((item, index) => <MenuItem key={index}>{item}</MenuItem>)}
      </Menu>
    );
  };

  toTitle = (hasPO, type) => {
    if (hasPO) {
      return (
        <Dropdown overlay={this.toMenu()}>
        <span className='ant-dropdown-link' data-role='title'>
          {MENU_ITEMS[type]}<Icon type='down'/>
        </span>
        </Dropdown>
      );
    } else {
      return MENU_ITEMS[1];
    }
  };

  disabledDate = (current) => {
    return current && current.valueOf() > Date.now();
  };

  render() {
    const {hasPO, height, items, type, date, month, loading=false} = this.props;
    const style = height ? {height} : null;
    const m = moment(date);
    const pickerProps = {
      value: m,
      size: 'small',
      placeholder: '月份',
      allowClear: false,
      onChange: this.onChange,
      disabledDate: this.disabledDate
    };
    return (
      <Card className={s.root} style={style}>
        <Title title={this.toTitle(hasPO, type)}>
          <MonthPicker {...pickerProps} />
        </Title>
        <Spin spinning={loading}>
          <div style={{height: height - 40}}>
            {this.toChart(month, items)}
          </div>
        </Spin>
      </Card>
    );
  }
}

export default withStyles(s)(Statistics);
