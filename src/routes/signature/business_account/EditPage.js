import React, { PropTypes } from 'react';
import {SuperTable, SuperForm, Card, Title, SuperToolbar} from '../../../components/index';
import {getObject} from "../../../common/common";

const TOOLBAR_EVENTS = ['onClick']; // 工具栏点击事件

class EditPage extends React.Component {

  toForm1 = () => {
    const {controls1, onChange, value, onExitValid, valid} = this.props;
    const props = {controls: controls1, value, onChange, onExitValid, valid};
    return <SuperForm {...props} />
  };

  toTable = () => {
    const {tableCols, rule} = this.props;
    const props = {cols: tableCols, items: rule};
    return <SuperTable {...props}/>
  };

  toForm2 = () => {
    const {controls2, onChange, value, onExitValid, valid} = this.props;
    const props = {controls: controls2, value, onChange, onExitValid, valid};
    return <SuperForm {...props}/>
  };

  toButtons = () => {
    const {buttons,} = this.props;
    const props = { buttons, size: 'default', callback: getObject(this.props, TOOLBAR_EVENTS )};
    return <div style={{textAlign: 'center', marginTop: '20px'}}><SuperToolbar {...props}/></div>
  };

  render(){
    return (
      <Card>
        <Title title = "客户信息" />
        {this.toForm1()}
        <Title title = "套餐列表" />
        {this.toTable()}
        <Title title = "填写金额" />
        {this.toForm2()}
        {this.toButtons()}
      </Card>
    )
  }
}

export default EditPage
