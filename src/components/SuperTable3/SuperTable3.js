import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {getTitle} from '../Control';
import {Table, Button} from 'antd';
import fixed from '../SuperTable/fixed';
import s from './SuperTable3.less';

const ColType = {
  key: PropTypes.string.isRequired,
  title: PropTypes.string,
  align: PropTypes.oneOf(['left', 'center', 'right']),
  hide: PropTypes.bool,
  sort: PropTypes.bool,
  options: PropTypes.array
};

const ItemType = {
  checked: PropTypes.bool
};

/**
 * onCheck：点击复选框时触发，原型func(isAll, checked, rowIndex)
 * onDoubleClick: 行双击时触发，原型func(rowIndex)
 * onLink: 点击超链接时触发，原型为func(key, rowIndex, item)
 * onIconClick: 点击Icon时触发，原型为func(key, rowIndex, item)
 */
const CallbackType = {
  onCheck: PropTypes.func,
  onDoubleClick: PropTypes.func,
  onLink: PropTypes.func,
  onIconClick: PropTypes.func
};

/**
 * checkbox: [可选]，是否有复选框，默认为true
 * index: [可选]，是否有序号，默认值为true
 * indexTitle：[可选]，序号标题，默认为'序号'
 * maxHeight: [可选]，设置表格的最大高度
 */
class SuperTable3 extends React.Component {
  static propTypes = {
    cols: PropTypes.arrayOf(PropTypes.shape(ColType)).isRequired,
    items: PropTypes.arrayOf(PropTypes.shape(ItemType)).isRequired,
    expandedRowRender: PropTypes.func,
    checkbox: PropTypes.bool,
    index: PropTypes.bool,
    indexTitle: PropTypes.string,
    maxHeight: PropTypes.string,
    callback: PropTypes.shape(CallbackType)
  };

  onChange = (selectedKeys) => {
    const {onCheck} = this.props.callback || {};
    if (onCheck) {
      if (selectedKeys.length === 0) {
        onCheck(true, false, -1);
      } else if (selectedKeys.length === this.props.items.length) {
        onCheck(true, true, -1);
      } else  {
        const defaultSelectedKeys = this.getSelectedRowKeys(this.props.items);
        if (selectedKeys.length > defaultSelectedKeys.length) {
          onCheck(false, true, selectedKeys[selectedKeys.length - 1]);
        } else {
          const index = defaultSelectedKeys.findIndex(key => !selectedKeys.some(select => select === key));
          onCheck(false, false, defaultSelectedKeys[index]);
        }
      }
    }
  };

  onRowClick = (record, index) => {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      const {onCheck} = this.props.callback || {};
      onCheck && onCheck(false, !record.checked, index);
    }, 250);
  };

  onDoubleClick = (record, index) => {
    clearTimeout(this.timer);
    const {onDoubleClick} = this.props.callback || {};
    onDoubleClick && onDoubleClick(index);
  };

  onLink = (key, index, item, e) => {
    const {onLink} = this.props.callback || {};
    onLink && onLink(key, index, item);
    e.stopPropagation();
  };

  onIconClick = (key, index, item, e) => {
    const {onIconClick} = this.props.callback || {};
    onIconClick && onIconClick(key, index, item);
    e.stopPropagation();
  };

  onLinkDouble = (e) => {
    e.stopPropagation();
  };

  getSelectedRowKeys = (items) => {
    return items.reduce((result, item, index) => {
      item.checked && result.push(index);
      return result;
    }, []);
  };

  getIndexInfo = () => {
    const {index=true, indexTitle='序号'} = this.props;
    return index ? [{key: 'index', title: indexTitle}] : [];
  };

  getColumns = (cols) => {
    return this.getIndexInfo().concat(cols.filter(col => !col.hide)).map(col => {
      const className = col.key === 'index' ? 'ant-table-selection-column' : (col.align ? s[col.align] : '');
      return Object.assign({}, col, {dataIndex: col.key, className});
    });
  };

  getText = (value, options) => {
    if (Array.isArray(value)) {
      return value.map(v => getTitle(v, options)).toString();
    } else {
      return getTitle(value, options);
    }
  };

  getDataSource = (items, cols) => {
    return items.map((item, index) => {
      return cols.reduce((result, {key, options, link, icon}) => {
        const onIconClick = this.onIconClick.bind(null, key, index, item);
        if (link) {
          const onClick = this.onLink.bind(null, key, index, item);
          result[key] = (
            <div>
              <a onClick={onClick} onDoubleClick={this.onLinkDouble}>
                {this.getText(item[key], options)}
              </a>
              {icon && this.getText(item[key], options) && <Button role="marker" onClick={onIconClick} icon={icon} style={{border: 'none'}} ghost />}
            </div>);
        } else {
          result[key] = (
            <div>
              {this.getText(item[key], options)}
              {icon && this.getText(item[key], options) && <Button role="marker" onClick={onIconClick} icon={icon} style={{border: 'none'}} ghost />}
            </div>);
        }
        return result;
      }, {index: index + 1, key: index, checked: item.checked});
    });
  };

  getPropsByCheckbox = () => {
    const {checkbox = true, items} = this.props;
    return !checkbox ? {} : {
      onRowClick: this.onRowClick,
      rowClassName: (record, index) => items[index].checked ? s.select : '',
      rowSelection: {
        selectedRowKeys: this.getSelectedRowKeys(items),
        onChange: this.onChange
      }
    };
  };

  onExpand = (expanded, record) => {
    const {onExpand} = this.props;
    onExpand && onExpand(expanded, record.key);
  };

  getProps = () => {
    const {cols, items, expandedRowRender, expandedRowKeys=[]} = this.props;
    return {
      className: s.root,
      columns: this.getColumns(cols),
      dataSource: this.getDataSource(items, cols),
      style: {whiteSpace: 'nowrap'},
      size: 'small',
      pagination: false,
      scroll: {x: true},
      onRowDoubleClick: this.onDoubleClick,
      expandedRowRender,
      onExpand: this.onExpand,
      expandedRowKeys,
      ...this.getPropsByCheckbox()
    };
  };

  setScroll = () => {
    if (this.props.maxHeight) {
      const root = ReactDOM.findDOMNode(this);
      const container = root.getElementsByClassName('ant-table-body')[0];
      const headers = root.getElementsByClassName('ant-table-thead');
      const header = headers[headers.length-1];
      fixed(container, header, this.props.maxHeight);
    }
  };

  componentDidMount() {
    this.setScroll();
  }

  componentDidUpdate() {
    this.setScroll();
  }

  render() {
    return <Table {...this.getProps()} />;
  }
}

export default withStyles(s)(SuperTable3);
