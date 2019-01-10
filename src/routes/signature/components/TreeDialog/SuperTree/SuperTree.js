import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './SuperTree.less';
import {Tree,Input,Button} from 'antd';
const TreeNode = Tree.TreeNode;

const TreeType = {
  root: PropTypes.string
  // 如下均为key-value对，value取值为{key: <string>, title: <string>, parent: <string>, children: <string array>}
};

/**
 * 参数说明：
 *  tree：对象，用于存储一颗树的数据，其root属性表示根节点的key
 *  select：表示选中条目的key
 *  expand：对象，key-value对，key表示条目的key，value为true表示展开，为false表示折叠
 *  searchValue: 字符串或数组，为字符串时模糊匹配title(匹配部分标记红色)，为数组时匹配key(如果匹配则title整体标记为红色)
 *  onExpand：展开/折叠时触发，原型为function(key, expand)，expand为true表示展开
 *  onSelect：条目选中时触发，原型为function(key)，key标识所选条目
 *  value:input的内容,
 *  onChange: input 输入回调
 */
class SuperTree extends React.Component {
  static propTypes = {
    tree: PropTypes.shape(TreeType).isRequired,
    select: PropTypes.string,
    expand: PropTypes.object,
    searchValue: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    onExpand: PropTypes.func,
    onSelect: PropTypes.func,
    value:PropTypes.object,
    onChange: PropTypes.func
  };

  onSelect = (keys) => {
    const {onSelect} = this.props;
    if (onSelect && keys.length !== 0) {
      onSelect(keys[0]);
    }
  };

  onExpand = (expandedKeys, {expanded, node}) => {
    const {onExpand} = this.props;
    if (onExpand) {
      onExpand(node.props.eventKey, expanded);
    }
  };

  onChange = (value,key) => {
    const {onChange} = this.props;
    if (onChange) {
      onChange(value,key);
    }
  };


  title1 = (title,key, edit) => {
    const {value,onCancel,onOk} = this.props;
    if(edit === 'add'){
      return [
        <Input key={key} size='small' onChange={(e) => this.onChange(e.target.value,key)} value={value[key]}/>,
        <Button key='1' size='small' type="primary" style={{marginLeft:10,marginRight:10}} onClick={()=>onOk(key)}>确认</Button>,
        <Button key='2' size='small' onClick={() => onCancel(key)}>取消</Button>
      ];
    }else if(edit === 'edit'){
      return [
        <Input key={key} size='small' onChange={(e) => this.onChange(e.target.value,key)} value={value[key]}/>,
        <Button key='1' size='small' type="primary" style={{marginLeft:10,marginRight:10}} onClick={()=>onOk(key)}>确认</Button>,
        <Button key='2' size='small' onClick={() => onCancel(key)}>取消</Button>
      ];
    }
    else if(edit === 'del'){
      return [
        <span  key={key}>{title}</span>,
        <Button key='1' size='small' type="primary" style={{marginLeft:30,marginRight:10}} onClick={()=>onOk(key)}>确认</Button>,
        <Button key='2' size='small' onClick={() => onCancel(key)}>取消</Button>
        ];
    }else {
      return (
        <span>{title}</span>
      )
    }

  };

  title2 = (searchValue, title) => {
    const index = title.indexOf(searchValue);
    if (index > -1) {
      return (
        <span>
          {title.substr(0, index)}
          <span style={{color: '#f50'}}>{searchValue}</span>
          {title.substr(index + searchValue.length)}
        </span>
      );
    } else {
      return title;
    }
  };

  title3 = (searchValue, title, key) => {
    if (searchValue.includes(key)) {
      return <span style={{color: '#f50'}}>{title}</span>;
    } else {
      return title;
    }
  };



  initTitle = () => {
    const {searchValue,tree} = this.props;
    if (searchValue) {
      if (Array.isArray(searchValue)) {
        if (searchValue.length) {
          this.title = this.title3.bind(null, searchValue);
        } else {
          this.title = this.title1;
        }
      } else {
        this.title = this.title2.bind(null, searchValue);
      }
    } else {
      this.title = this.title1;
    }
  };

  node = (tree, keys) => {
    return keys.map(key => {
      const {title, children,disabled = false} = tree[key];
      return (
        <TreeNode key={key} title={ this.title(title, key,tree[key].edit)} disabled={disabled}>
          {children ? this.node(tree, children) : null}
        </TreeNode>
      );
    });
  };

  nodes = () => {
    const {tree} = this.props;
    if (tree.root) {
      this.initTitle();
      return this.node(tree, tree[tree.root].children);
    } else {
      return null;
    }
  };

  render() {
    const {select, expand={}} = this.props;
    const props = {
      selectedKeys: [select],
      expandedKeys: Object.keys(expand).filter(key => expand[key]),
      autoExpandParent: false,
      onSelect: this.onSelect,
      onExpand: this.onExpand
    };
    return <div className={s.root}><Tree {...props}>{this.nodes()}</Tree></div>;
  }
}

export default withStyles(s)(SuperTree);
