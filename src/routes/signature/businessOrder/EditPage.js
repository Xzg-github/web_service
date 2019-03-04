import React, {PropTypes} from 'react';
import {Card, Title, Indent, SuperForm, SuperToolbar, SuperTable, SuperPagination} from '../../../components';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './EditPage.less';
import { getObject } from '../../../common/common';

/*
  企业订单查看消费明细页面
  baseInfo: 基本信息表单项
  consumptionStatisticsInfo: 消费统计列表
  consumptionDetail: 消费明细列表
 */

const PAGINATION = ['maxRecords', 'pageSize', 'currentPage', 'pageSizeType', 'description',
  'onPageNumberChange', 'onPageSizeChange'];

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
      items: value.table1
    };
    return <SuperTable {...tableProps}/>
  };

  toConsumptionDetail = () => {
    const {consumptionDetail, value} = this.props;
    const table2Props = {
      checkbox: false,
      cols: consumptionDetail,
      items: value.table2
    };
    return <SuperTable {...table2Props}/>
  };

  toButton = () => {
    const {editPageButton, onClick} = this.props;
    const barProps = {
      size: 'large',
      buttons: editPageButton,
      onClick: onClick.bind(null, this.props)
    };
    return <SuperToolbar {...barProps}/>
  };

  toPagination = () => {
    const props = getObject(this.props, PAGINATION);
    return <SuperPagination {...props}/>;
  };

  render() {
    const baseTitle = '基本信息';
    const consumptionStatisticsTitle = '消费统计';
    const consumptionDetailTitle = '消费明细';
    return(
      <Card>
        {this.toTitle(baseTitle)}
        <Indent>{this.toBaseInfo()}</Indent>
        <div className={s.table1}>
          {this.toTitle(consumptionStatisticsTitle)}
          <Indent>{this.toConsumptionStatisticsTable()}</Indent>
        </div>
        {this.toTitle(consumptionDetailTitle)}
        <Indent>{this.toConsumptionDetail()}</Indent>
        <div className={s.pagination}>{this.toPagination()}</div>
        <div className={s.footer}>
          {this.toButton()}
        </div>
      </Card>
    )
  }
};

export default withStyles(s)(EditPage);
