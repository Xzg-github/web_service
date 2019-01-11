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
      valid: props.valid,
      cols: props.cols,
      items: props.tableItems,
      maxHeight: `calc(100vh - 223px)`,
      callback :{
        onContentChange: props.onContentChange,
        onCheck: props.onCheck,
        onExitValid: props.onExitValid,
      }
    };
  };

  toolbarProps = (props,buttons,size='default') => {
    return {
      size,
      buttons,
      onClick: props.onClick.bind(null, props)
    };
  };




  render() {
    const props = this.props;
    return (
      <Card className={s.root}>
        <Indent>
          <SuperForm {...this.formProps(props)} />
        </Indent>
        <Title title='组员信息'  role='title'/>
        <div className={s.button}>
          {props.look ? null : <SuperToolbar {...this.toolbarProps(props,props.tableButtons,'small')} />}
        </div>
        <Indent>
          <SuperTable2 {...this.tableProps(props)}/>
        </Indent>
        {props.look ? null : <SuperToolbar {...this.toolbarProps(props,props.buttons)} />}
      </Card>
    );
  }
}

export default withStyles(s)(EditPage);
