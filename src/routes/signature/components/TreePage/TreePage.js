import React, { PropTypes } from 'react';
import { getObject } from '../../../../common/common';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './TreePage.less';
import {SuperTable, SuperToolbar, SuperTree, Card, Search,SuperPagination} from '../../../../components/index';
import {Input} from 'antd';
const InputSearch = Input.Search;

const TREE_PROPS = ['tree', 'expand', 'select', 'searchValue', 'onExpand', 'onSelect'];
const TABLE_EVENTS = ['onCheck', 'onDoubleClick','onLink'];
const SEARCH_EVENTS = ['onChange', 'onSearch', 'onClick'];
const PAGINATION = ['maxRecords', 'pageSize', 'currentPage', 'pageSizeType', 'description',
  'onPageNumberChange', 'onPageSizeChange'];


const props = {
  tableCols: PropTypes.array,
  tableItems: PropTypes.array,
  buttons: PropTypes.array,
  tree: PropTypes.object,
  expand: PropTypes.object,
  select: PropTypes.string,
  searchValue: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  inputValue: PropTypes.string,
  placeholder: PropTypes.string,
  onInputChange: PropTypes.func,
  onClick: PropTypes.func,
  filters: PropTypes.array,
  searchData: PropTypes.object,
  searchConfig: PropTypes.object,
  pageSize: PropTypes.number,
  pageSizeType: PropTypes.array,
  description: PropTypes.string,
  paginationConfig: PropTypes.object  // 该属性将被description替代
};

class TreePage extends React.Component {
  static propTypes = props;
  static PROPS = Object.keys(props);

  onInputChange = (e) => {
    const {onInputChange} = this.props;
    onInputChange && onInputChange(e.target.value);
  };

  getSearchProps = () => {
    return {
      value: this.props.inputValue || '',
      placeholder: this.props.placeholder,
      onChange: this.onInputChange,
      onSearch: this.props.onClick.bind(null, 'searchTree')
    }
  };

  getToolbarProps = () => {
    return {
      buttons: this.props.buttons,
      onClick: this.props.onClick,
    };
  };

  getTreeProps = () => {
    return getObject(this.props, TREE_PROPS);
  };

  getTableProps = () => {
    const {tableCols, tableItems, buttons} = this.props;
    const extra = buttons.length ? 0 : -32;
    return {
      cols: tableCols,
      items: tableItems,
      maxHeight: `calc(100vh - ${36 + 219 + extra}px)`,
      callback: getObject(this.props, TABLE_EVENTS)
    };
  };


  toTabContent = () => {
    const butsProps = {
      onClick: this.props.onClick,
      buttons: this.props.treeButtons,
      size:'default'
    };
    return (
      <Card noPadding>
        <div><InputSearch {...this.getSearchProps()} /></div>
        <SuperToolbar {...butsProps} />
        <SuperTree {...this.getTreeProps()} />
      </Card>
    )
  };

  toSearch = () => {
    const {filters, searchConfig, searchData} = this.props;
    const props = {
      filters,
      data: searchData,
      config: searchConfig,
      ...getObject(this.props, SEARCH_EVENTS),
      onHeightChange: this.onHeightChange
    };
    return <Search {...props}/>;
  };

  toPagination = () => {
    let props = getObject(this.props, PAGINATION);
    if (!props.description && this.props.paginationConfig) {
      props.description = this.props.paginationConfig.pageDesp;
    }
    return <SuperPagination {...props}/>;
  };

  render = () => {
    return (
      <div className={s.root}>
        <div>
          {this.toTabContent()}
        </div>
        <Card>
          {this.toSearch()}
        </Card>
        <Card>
          <SuperToolbar {...this.getToolbarProps()} />
          <SuperTable {...this.getTableProps()} />
          {this.toPagination()}
        </Card>
      </div>
    );
  };
}

export default withStyles(s)(TreePage);
