import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import {Alert} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './OrderPage.less';
import {Card,SuperToolbar} from '../../../../../components/index';




class OrderPage extends React.Component {

  constructor(props) {
    super(props);
  }




  render() {
    const props = this.props;

    return (
      <div className={s.root}>
        <Card>

        </Card>
      </div>
    );
  };
}

export default withStyles(s)(OrderPage);
