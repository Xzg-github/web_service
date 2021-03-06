import React , {PropTypes}from 'react';
import ReactDOM from 'react-dom';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {Upload, Icon,Radio,Checkbox} from 'antd';
import helper from '../../../../../common/common';
import s from './UploadDialog.less';

const RadioGroup = Radio.Group;

/**
 * onCheck：勾选框的回调
 * index: 唯一标识
 * checkValue: 对象，判断是哪一个box被勾选
 * radioValue: 对象，判断是哪一个box被勾选
 *
 */

class UploadDialog extends React.Component {
  static propTypes = {
    onCheck:PropTypes.func,
    index:PropTypes.string,
    checkValue:PropTypes.object
  };


  onClick = (key) => {
    this.props.onClick(key);
  };



  render() {
    const { checkValue,index,onCheck,onRadio,radioValue } = this.props;
    return (
      <div className={s.root}>
        <div className={s.box}>
          <Checkbox className={s.checkbox} checked={checkValue[index]} onChange={(e)=>onCheck(e.target.checked,index)}/>
          <div className={s.boxTop}>
            <img src={ require('../../../../../../public/default_picture.png')} alt=""/>
          </div>
          <div className={s.boxBottom}>
            <RadioGroup value={radioValue[index]} onChange={(e)=>onRadio(e.target.checked,index)}>
              <Radio value={true}>默认签章</Radio>
            </RadioGroup>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(UploadDialog);
