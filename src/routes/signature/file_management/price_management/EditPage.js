import React, {PropTypes} from 'react';
import {Card, Title, Indent, SuperForm, SuperToolbar,SuperTable,SuperTable2} from '../../../../components';
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './EditPage.less';
import { getObject } from '../../../../common/common';

const TABLE_EVENTS = ['onLink'];

class EditPage extends React.Component {
  static propTypes = {
    buttons: PropTypes.array,
    value: PropTypes.object,
    valid: PropTypes.string,
    options: PropTypes.object,
    onExitValid: PropTypes.func,
    onClick: PropTypes.func
  };

  formProps = (props ) => {
    return {
      readonly: false,
      container: true,
      controls: props.controls,
      value: props.value,
      valid: props.valid,
      options: props.options,
      onChange: props.onChange,
      onSearch: props.onSearch,
      onExitValid: props.onExitValid,
    };
  };

  tableProps = (props) => {
    return  {
      cols: props.cols,
      items: props.tableItems ? props.tableItems: [],
      callback: getObject(props, TABLE_EVENTS),
      maxHeight: `calc(100vh - 223px)`
    };
  };

  toolbarProps = (props) => {
    return {
      size: 'default',
      buttons: props.buttons,
      onClick: props.onClick.bind(null, props)
    };
  };

  toolbarProps1 = (props) => {
    return {
      size: 'small',
      buttons: props.colsButtons,
      onClick: props.onClick.bind(null, props)
    };
  };




  render() {
    const props = this.props;
    return (
      <Card className={s.root}>
        <Title title="账单信息"/>
        <Indent>
          <SuperForm {...this.formProps(props)} />
        </Indent>
        <Title title='商品明细'/>
        <Indent>
          {props.look ? null : <SuperToolbar {...this.toolbarProps1(props)} />}
          <SuperTable2 {...this.tableProps(props)}/>
        </Indent>
        <div className={s.footer}>
          {props.look ? null : <SuperToolbar {...this.toolbarProps(props)} />}
        </div>
      </Card>
    );
  }
}

export default withStyles(s)(EditPage);
