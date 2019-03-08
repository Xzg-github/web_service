import React, { PropTypes } from 'react';
import withStyles from '../../../node_modules/isomorphic-style-loader/lib/withStyles';
import s from './OrderTabPage.less';
import {Search, SuperTable, SuperPagination, SuperToolbar, SuperTab2} from '../../components/index';
import Card from "../../components/Card/Card";
import {Alert} from 'antd';

const props = {
  subTabs: PropTypes.array,
  subActiveKey: PropTypes.string,
  tableCols: PropTypes.array,
  tableItems: PropTypes.object,
  buttons: PropTypes.array,
  filters: PropTypes.array,
  searchData: PropTypes.object,
  searchConfig: PropTypes.object,
  maxRecords: PropTypes.object,
  currentPage: PropTypes.object,
  pageSize: PropTypes.object,
  pageSizeType: PropTypes.array,
  description: PropTypes.string,
  paginationConfig: PropTypes.object  // 该属性将被description替代
};

class OrderTabPage extends React.Component {
  static propTypes = props;
  static PROPS = Object.keys(props);

  constructor(props) {
    super(props);
    this.state = {height: 67};
  }

  onHeightChange = (height) => {
    this.setState({height});
  };

  getContainer = () => {
    return document.body;
  };

  onHandleClick = (key) => {
    const {subActiveKey, onClick, onClickReset, onClickSearch} = this.props;
    switch (key) {
      case 'reset': {
        onClickReset();
        break;
      }
      case 'search': {
        onClickSearch();
        break;
      }
      default:
        onClick && onClick(subActiveKey, key);
    }
  };

  toSearch = () => {
    const {filters, searchConfig, searchData, onChange, onSearch} = this.props;
    const props = {
      filters,
      data: searchData,
      config: searchConfig,
      getContainer: this.getContainer,
      onHeightChange: this.onHeightChange,
      onChange,
      onSearch,
      onClick: this.onHandleClick
    };
    return <Search {...props}/>;
  };

  toToolbar = () => {
    const {subActiveKey, buttons} = this.props;
    const props = {
      buttons,
      onClick: this.onHandleClick
    };
    return <SuperToolbar {...props} />;
  };

  toTable = () => {
    const {subActiveKey, tableCols, tableItems, buttons, sortInfo, filterInfo, onCheck, onDoubleClick, onLink, onTableChange} = this.props;
    const extra = buttons.length ? 0 : -33;
    const props = {
      sortInfo: sortInfo[subActiveKey],
      filterInfo: filterInfo[subActiveKey],
      cols: tableCols,
      items: tableItems[subActiveKey] || [],
      callback: {
        onCheck: onCheck.bind(null, subActiveKey),
        onDoubleClick: onDoubleClick ? onDoubleClick.bind(null, subActiveKey) : undefined,
        onLink: onLink ? onLink.bind(null, subActiveKey) : undefined,
        onTableChange: onTableChange.bind(null, subActiveKey)
      },
      maxHeight: `calc(100vh - ${this.state.height + 322 + extra}px)`
    };
    return <SuperTable {...props}/>;
  };

  toPagination = () => {
    const {subActiveKey, maxRecords, pageSize, currentPage, pageSizeType, onPageNumberChange, onPageSizeChange} = this.props;
    let props = {
      maxRecords: maxRecords[subActiveKey],
      pageSize: pageSize[subActiveKey],
      currentPage: currentPage[subActiveKey],
      pageSizeType,
      onPageNumberChange,
      onPageSizeChange
    };
    if (!props.description && this.props.paginationConfig) {
      props.description = this.props.paginationConfig.pageDesp;
    }
    return <SuperPagination {...props}/>;
  };

  toTab = () => {
    const {subTabs, isTotal, maxRecords, subActiveKey, onSubTabChange,tabsNumber} = this.props;
    const tabs = isTotal ? subTabs.map((tab,index) => {
      return {...tab, title: `${tab.title}(${tabsNumber[index] ? tabsNumber[index] : 0})`};
    }) : subTabs;
    const props = {
      activeKey: subActiveKey,
      tabs,
      onTabChange: onSubTabChange
    };
    return <div style={{marginBottom: '10px'}}><SuperTab2 {...props} /></div>;
  };


  toAlert = () => {
    const {onAuthentication} = this.props;
    const messageStr = () => {
      return (
        <p>
          您的账号还未完成实名认证，请先认证，以获取专属CA证书、订购套餐、签发文件资格等服务
          <span className={s.hearder_box} onClick={onAuthentication}>未发起认证</span>
        </p>
      )

    };
    const props = {
      type:'info',
      message:messageStr(),
      showIcon:true,
    };
    return (
      <Alert {...props}/>
    );
  };

  render = () => {
    return (
      <div className={s.root}>
        {this.toAlert()}
        <Card>
        {this.toSearch()}
        </Card>
        <Card>
        {this.toTab()}
        {this.toToolbar()}
        {this.toTable()}
        {this.toPagination()}
        </Card>
      </div>
    );
  };
}

export default withStyles(s)(OrderTabPage);
