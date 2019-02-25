import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './SecondPage.less';
import {Card,SuperToolbar} from '../../../../../components/index';
import { getObject } from '../../../../../common/common';
import UploadBox from './UploadDialog';

const TOOLBAR_EVENTS = ['onClick'];


class SecondPage extends React.Component {

  constructor(props) {
    super(props);
  }

  onClick = (key) => {
    this.props.onClick(key);
  };

  toToolbar = () => {
    const props = {
      buttons: this.props.buttons,
      callback: getObject(this.props, TOOLBAR_EVENTS)
    };
    return <SuperToolbar {...props} />;
  };

  toUpload = () => {

    const props = {
      onCheck:this.props.onCheck,
      onRadio:this.props.onRadio,
      index:'a',
      checkValue:this.props.checkValue,
      radioValue:this.props.radioValue
    };
    return <UploadBox {...props} />;
  };

  render() {
    const props = this.props;
    return (
      <div className={s.root}>
        <Card>
          {this.props.buttons.length > 0 ? this.toToolbar() : null}
          <div className={s.divBox}>
            {this.toUpload()}
            {this.toUpload()}
            {this.toUpload()}
            {this.toUpload()}
            {this.toUpload()}
            {this.toUpload()}
          </div>

        </Card>
      </div>
    );
  };
}

export default withStyles(s)(SecondPage);
