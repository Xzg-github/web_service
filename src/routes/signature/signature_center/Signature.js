import React, {PropTypes} from 'react';
import {getObject} from '../../../common/common';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import SuperTab from  '../../../components/SuperTab';
import s from './Signature.less';
import OrderTabPageContainer from './OrderTabPageContainer';
import EditPageContainer from './EditPageContainer/EditPageContainer';

class Append extends React.Component {
  static propTypes = {
    activeKey: PropTypes.string,
    tabs: PropTypes.array
  };

  toContent = (activeKey) => {
    if (activeKey === 'index') {
      return <OrderTabPageContainer />
    } else {
      return <EditPageContainer />;
    }
  };

  render() {
    const {activeKey} = this.props;
    return (
      <div className={s.root}>
        <SuperTab {...getObject(this.props, SuperTab.PROPS)} />
        {this.toContent(activeKey)}
      </div>
    );
  }
}

export default withStyles(s)(Append);

