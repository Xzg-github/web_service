import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import {Icon,Button,Avatar,InputNumber,Switch} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './OrderPage.less';
import {Card,Title} from '../../../../../components/index';




class OrderPage extends React.Component {

  constructor(props) {
    super(props);
  }

  onClick = (key) => {
    this.props.onClick(key);
  };


  toIcon = (key,item) => {
    if(item.type === 'edit'){
      return <Icon type="edit" onClick={() => this.onClick(key)} style={{fontSize:18,color:'#2196F3'}}/>
    }else if(item.type === 'button'){
      return <Button size='default' onClick={() => this.onClick(key)}>{item.btn}</Button>
    }else if(item.type === 'avatar'){
      return <Avatar size='large' icon="user" />
    }

  };

  toForm = (props) => {
    return(
      <div>{props.LABELS.map((item, index) =>{
        return <p key={index}>{`${item.title}:`}&nbsp;&nbsp;{props.value[item.key]}{item.type ?this.toIcon(item.key,item):null}</p>
      })}</div>
    )
  };


  remind = (props) => {
    const propsInput = {
      style: { width: '100px' },
      value: props.value['daysOfAdvanceNotice'],
      onChange:(value) => props.onChange('daysOfAdvanceNotice',value)
    };
    return (
      <div>
        提前&nbsp;&nbsp;<InputNumber {...propsInput}/>&nbsp;&nbsp;天提醒接收方处理快到期文件
      </div>
    )
  };

  check = (props) => {
    const chekckProps = {
      checkedChildren:'开',
      unCheckedChildren:'关',
    };
    return(
      <div>{props.checkItems.map((item, index) =>{
        return <p key={index}>{`${item.title}:`}<Switch {...chekckProps}
                                                        onChange={(checked)=>{props.onChange(item.key,checked)}}
                                                        checked={props.value[item.key]}/></p>
      })}</div>
    )
  };

  render() {
    const props = this.props;
    return (
      <div className={s.root}>
        <Card>
          <div className={s.box}>
            <Title title="基本信息"/>
            <div className={s.leftBox}>
              {this.toForm(props)}
            </div>
          </div>
          {/*<div className={s.box}>
            <Title title="提醒设置"/>
            <div className={s.topBox}>
              {this.remind(props)}
            </div>
            <Title title="通知设置"/>
            <div className={s.bottomBox}>
              {this.check(props)}
            </div>
          </div>*/}
        </Card>
      </div>
    );
  };
}

export default withStyles(s)(OrderPage);
