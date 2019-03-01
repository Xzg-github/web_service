import React, {PropTypes} from 'react';
import {Card, Title, Indent, SuperForm, SuperToolbar, SuperTable} from '../../../components';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './EditPage.less';

/*
  企业订单查看消费明细页面
  baseInfo: 基本信息表单项
  consumptionStatisticsInfo: 消费统计列表
  consumptionDetail: 消费明细列表
 */
class EditPage extends React.Component{
  static propTypes = {
    baseInfo: PropTypes.array.isRequired,
    consumptionStatisticsInfo: PropTypes.array,
    consumptionDetail: PropTypes.array,
    editPageButton: PropTypes.array
  };

  toTitle = (title) => {
    return <Title title={title}/>
  };

  toBaseInfo = () => {
    const {baseInfo, value} = this.props;
    const formProps = {
      controls: baseInfo,
      value: value
    }
    return <SuperForm {...formProps} />
  };

  toConsumptionStatisticsTable = () => {
    const {consumptionStatisticsInfo, value} = this.props;
    const tableProps = {
      checkbox: false,
      index: false,
      cols: consumptionStatisticsInfo,
      items: value
    };
    return <SuperTable {...tableProps}/>
  };

  toConsumptionDetail = () => {

  }
};
