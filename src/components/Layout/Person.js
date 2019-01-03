import React from 'react';
import {Input,Button} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Person.less';
import {ModalWithDrag} from '../../components';
import showPopup from '../../standard-business/showPopup';
import execWithLoading from '../../standard-business/execWithLoading';
import helper from '../../common/common';

const LABELS = [
  {key: 'account', title: '用户账号'},
  {key: 'userEmail', title: '邮箱',edit:true},
  {key: 'userCellphone', title: '联系电话',edit:true},
  {key: 'username', title: '中文名称',edit:true},
  {key: 'userEnglishName', title: '英文名称',edit:true},
  {key: 'userPosition', title: '岗位',edit:true},
  {key: 'institutionGuid', title: '归属机构'},
  {key: 'departmentGuid', title: '归属部门'},
  {key: 'tenantGuid', title: '所属租户'},
  {key: 'tenantId', title: '租户标识'},
];

class Person extends React.Component {
  state = {visible: true,LABELS:helper.deepCopy(LABELS),value:{}};

  getModalProps = () => {
    return {
      className: s.root,
      visible: this.state.visible,
      title: '个人信息',
      width: 350,
      footer: this.getFooter(),
      onCancel:() =>  this.setState({visible:false}),
      afterClose: this.props.onClose,

    };
  };

  getFooter = () => {
    return [
      <Button key='2' size='large' onClick={() =>  this.setState({visible:false})}>取消</Button>,
      <Button key='3' size='large' type='primary' onClick={this.onOk}>确定</Button>
    ];
  };

  onOk =() => {
    const {value} = this.state;
    execWithLoading(async()=>{
      const url = '/api/login/modify';
      const arr = ['userEmail','userCellphone','username','userEnglishName','userPosition','guid'];
      const newValue = helper.getObject(value,arr);
      const json = await helper.fetchJson(url,helper.postOption(newValue,'put'));
      if (json.returnCode === 0) {
        helper.showSuccessMsg('保存成功');
        this.setState({visible:false})
      } else {
        helper.showError(json.returnMsg);
      }
    })
  };


  componentDidMount () {
    this.setState({
      value:this.props.data
    })

  }



  onChange = (key,e) => {
    const {value} = this.state;
    this.setState({
      value:{...value,[key]:e.target.value},
      changeState:true
    })
  };

  fromProps = (item,index) => {
    const {value} = this.state;
    return {
      value:value[item.key],
      size:'small',
      onChange:this.onChange.bind(this,item.key),
    }
  };


  render() {
    const data = this.state.value;
    const {LABELS} = this.state;
    return (
      <ModalWithDrag {...this.getModalProps()}>
        <div>{LABELS.map((item, index) => <div key={index}>{`${item.title}:`}</div>)}</div>
        <div>{LABELS.map((item, index) =>
          item.edit? <Input key={index} {...this.fromProps(item,index)} ref={index}/>:<div key={index} data-no={!data[item.key]}>{data[item.key] || '无'}</div>
        )}
        </div>
      </ModalWithDrag>
    );
  }
}

const showPerson = () => {
  execWithLoading(async () => {
    const url = '/api/login/person';
    const json = await helper.fetchJson(url);
    if (json.returnCode === 0) {
      showPopup(withStyles(s)(Person), {data: json.result});
    } else {
      helper.showError(json.returnMsg);
    }
  });
};

export default showPerson;
