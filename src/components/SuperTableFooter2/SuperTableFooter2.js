import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { getTitle } from '../Control';
import { Table, Checkbox, Button } from 'antd';
import SuperTableCell from './SuperTableCell';
import s from './SuperTableFooter2.less';

const TypeEnum = [
  'readonly',
  'index',
  'checkbox',
  'text',
  'number',
  'select',
  'search',
  'date',
  'button',
  'custom'
];

/**
 * key：标识所在列，在一个表格中必须唯一
 * title：列的标题，type为checkbox时，title为空字符串时，表头才会显示为复选框
 * type：嵌入的表单元素类型
 * options: 对象(包含value和title)数组
 * props：传递参数给被嵌入的组件
 * width: 嵌入的组件的宽度，默认值为100
 * align：对齐方式，index默认center，其他类型默认为left
 */
const ColType = {
  key: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  totalTitle: PropTypes.string,
  type: PropTypes.oneOf(TypeEnum).isRequired,
  align: PropTypes.oneOf(['left', 'center', 'right']),
  width: PropTypes.number,
  options: PropTypes.array,
  props: PropTypes.any,
  isTotal: PropTypes.bool
};

/**
 * onCheck：点击复选框时触发，原型func(rowIndex, keyName, checked)
 * onContentChange: 输入框内容改变时触发，原型为function(rowIndex, keyName, value)
 * onSearch：search组件输入内容时触发，原型为function(rowIndex, keyName, value)
 * onRenderCustom：(废弃)用于渲染type为custom类型的单元格，原型为function(rowIndex, keyName, value，props)
 */
const CallbackType = {
  onExitValid: PropTypes.func,
  onCheck: PropTypes.func,
  onContentChange: PropTypes.func,
  onSearch: PropTypes.func,
  onRenderCustom: PropTypes.func
};

class SuperTableFooter2 extends React.Component {
  static propTypes = {
    footerTitle: PropTypes.string,
    cols: PropTypes.arrayOf(PropTypes.shape(ColType)).isRequired,
    items: PropTypes.array.isRequired,
    valid: PropTypes.bool,
    callback: PropTypes.shape(CallbackType)
  };

  onCheck = (key, rowIndex) => (e) => {
    const { onCheck } = this.props.callback || {};
    if (onCheck) {
      onCheck(rowIndex, key, e.target.checked);
    }
  };

  onChange = (key, rowIndex) => (value) => {
    const { onContentChange } = this.props.callback || {};
    this.closeValid();
    if (onContentChange) {
      onContentChange(rowIndex, key, value);
    }
  };

  onSearch = (key, rowIndex) => (value) => {
    const { onSearch } = this.props.callback || {};
    if (onSearch) {
      onSearch(rowIndex, key, value);
    }
  };

  onBlur = () => {
    this.closeValid();
  };

  closeValid = () => {
    if (this.props.valid) {
      this.props.callback.onExitValid();
    }
  };

  getOptions = (key, colOptions, index) => {
    const { options } = this.props.items[index];
    if (options && Array.isArray(options[key])) {
      return options[key];
    } else {
      return colOptions;
    }
  };

  validField = (required, value) => {
    if (!this.props.valid || this.error || !required || value) {
      return false;
    } else if (typeof value === 'number') {
      return false;
    } else {
      this.error = true;
      return true;
    }
  };

  renderEditableCell = ({ key, type, options, props, required, width }, value, index) => {
    const cellProps = {
      type, props, value,
      width: width || 100,
      error: this.validField(required, value),
      options: this.getOptions(key, options, index),
      onChange: this.onChange(key, index),
      onSearch: this.onSearch(key, index),
      onBlur: this.onBlur
    };
    return {
      children: <SuperTableCell {...cellProps} />,
      props: { style: { width: 1 } }
    };
  };

  renderCell = (col) => (value, record, index) => {
    if (col.type === 'checkbox') {
      return <Checkbox onChange={this.onCheck(col.key, index)} checked={value || false} />;
    } else if (col.type === 'index') {
      return { children: index + 1, props: { style: { width: 1 } } };
    } else if (col.type === 'button') {
      const onClick = this.props.callback.onBtnClick.bind(null, index, col.key);
      return <Button onClick={onClick} size='small'>{col.typeRelated}</Button>;
    } else if (col.type === 'custom') {
      return this.props.callback.onRenderCustom(index, col.key, value, col.props);
    } else {
      return this.renderEditableCell(col, value, index);
    }
  };

  getCheckedStatus = (key) => {
    let has = false, not = false;
    const { items } = this.props;
    for (const item of items) {
      item[key] ? (has = true) : (not = true);
    }
    return { checked: has && !not, indeterminate: has && not };
  };

  getColumnTitle = ({ required, title, type, key }) => {
    if (type === 'checkbox') {
      const status = this.getCheckedStatus(key);
      return <Checkbox onChange={this.onCheck(key, -1)} {...status} />;
    } else if (required) {
      return <span className={s.required}>{title}</span>;
    } else {
      return title;
    }
  };


  getColumnClassName = ({ type, align }) => {
    if (type === 'index') {
      return s.center;
    } else if (type === 'checkbox') {
      return 'ant-table-selection-column';
    } else {
      return align ? s[align] : '';
    }
  };

  getColumns = (cols) => {
    return cols.map(col => {
      const newState = {
        className: this.getColumnClassName(col),
        title: this.getColumnTitle(col),
        dataIndex: col.key,
        render: this.renderCell(col)
      };
      return Object.assign({}, col, newState);
    });
  };

  getDataSource = (items, cols) => {
    return items.map((item, index) => {
      return cols.reduce((result, { key, options }) => {
        result[key] = getTitle(item[key], options);
        return result;
      }, { key: index });
    });
  };

  countTotal = (col, items) => {
    let total = 0;
    const { key, decimalDigits = 0, props={} } = col;
    const precision = props.precision || decimalDigits;
    items.map(item => {
      let num = parseFloat(item[key]);

      if (isNaN(num)) {
        num = 0;
      }
      total += num;
    });
    return precision > 0 && total > 0 ? total.toFixed(precision) : total;
  };

  toItemTotal = (item, index, items) => {
    const total = this.countTotal(item, items);
    return (
      <span style={{ marginRight: 15 }} key={index}>
        {item.totalTitle ? item.totalTitle : item.title}：{total}
      </span>
    );
  };

  toFooter = (cols, items) => {
    const { footerTitle = '总计：' } = this.props;
    let showFooter = false;
    const list = [];

    cols.map((item, index) => {
      if (item.isTotal) {
        showFooter = true;
        list.push(this.toItemTotal(item, index, items));
      }
    });
    if (!showFooter || items.length == 0) return '';
    return (
      <div>
        <span style={{ marginRight: 30 }}>{footerTitle}</span>
        <span style={{ marginRight: 15 }}>总项目数：{items.length}</span>
        {list}
      </div>
    )
  };

  /**
   * 执行计算公式，计算出的值显示
   */
  calculationFun = (cols, items) => {
    cols.map(item => {
      if (item.calculationRule != null) {
        items.map(obj => {
          const calculationRule = item.calculationRule.replace(/key/g, 'obj');
          let num = eval(calculationRule);

          if (isNaN(num)) {
            num = 0;
          }
          obj[item.key] = num;
        });
      }
    });
  };

  getPropsByCheckbox = () => {
    const {items} = this.props;
    const rowClassName = (record) => {
      return items[record.key].checked ? s.select : '';
    };
    return {
      rowClassName: rowClassName
    }
  };

  getProps = () => {
    const { cols, items } = this.props;
    this.calculationFun(cols, items);
    return {
      className: s.root,
      columns: this.getColumns(cols),
      dataSource: this.getDataSource(items, cols),
      style: { whiteSpace: 'nowrap' },
      size: 'small',
      scroll: { x: true },
      pagination: false,
      footer: () => this.toFooter(cols, items),
      ...this.getPropsByCheckbox()
    };
  };

  render() {
    this.error = false;
    return <Table {...this.getProps() } />;
  }
}

export default withStyles(s)(SuperTableFooter2);
