import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './SuperSteps.less';
import {Steps, Icon} from 'antd';
const Step = Steps.Step;

/**
 * icon: 图标
 * status: 状态
 * title: 标题
 * description: 详情描述列表
 */
const StepType = {
  icon: PropTypes.string,
  status: PropTypes.oneOf(['wait', 'process', 'finish', 'error']),
  title: PropTypes.string,
  description: PropTypes.object
};

/**
 * current: 当前步骤
 * direction: 步骤条方向,默认‘horizontal’横向
 * size: 步骤条大小,默认‘small’迷你大小
 */
class SuperSteps extends React.Component {
  static propTypes = {
    current: PropTypes.number,
    status: PropTypes.oneOf(['wait', 'process', 'finish', 'error']),
    direction: PropTypes.oneOf(['horizontal', 'vertical']),
    size: PropTypes.oneOf(['default', 'small']),
    steps: PropTypes.arrayOf(PropTypes.shape(StepType)).isRequired,
    onIconClick: PropTypes.func,
    onLink: PropTypes.func
  };

  static PROPS = ['current', 'status', 'direction', 'size', 'steps'];

  getEvent = (name) => {
    if (this.props[name]) {
      return this.props[name];
    } else {
      return null;
    }
  };

  callEvent = (name, key) => {
    const onEvent = this.getEvent(name);
    if (onEvent) {
      onEvent(key);
    }
  };

  onClick = (originData) => {
    this.callEvent('onIconClick', originData);
  };

  onLink = (linkItem) => {
    this.callEvent('onLink', linkItem);
  };

  toDescription = (description) => {
    const {textList=[], linkList=[], linkTitleKey} = description;
    return (
      <div>
        {textList.map((item, index) => (<div key={index} style={{margin: '10px 0px'}}>{item}</div>))}
        {linkList.map((item2, index2) => {
          const onClick = this.onLink.bind(null, item2);
          return <a key={index2} onClick={onClick} style={{marginRight: '10px'}}>{item2[linkTitleKey]}</a>;
        })}
      </div>
    );
  };

  toStep = ({description, title, status, originData, icon='pld-track'}, index) => {
    const descriptionNode = this.toDescription(description);
    return <Step key={index} title={title} status={status} description={descriptionNode} icon={this.toIcon(icon, originData)}/>;
  };

  toIcon = (type, originData) => {
    const cursor = this.props.onIconClick ? 'pointer' : 'default';
    return <Icon type={type} style={{fontSize: 16, verticalAlign: -2, cursor}} onClick={this.onClick.bind(null, originData)} />;
  };

  getStepsProps = () => {
    const {current, status, direction, size='small'} = this.props;
    return {
      current, status, direction, size,
      className: s.root
    }
  };

  render() {
    return (
      <Steps {...this.getStepsProps()}>
        {this.props.steps.map(this.toStep)}
      </Steps>
    );
  }
}

export default withStyles(s)(SuperSteps);
