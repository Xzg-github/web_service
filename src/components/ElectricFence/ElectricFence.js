import React, {PropTypes} from 'react';
import {Input} from 'antd';
import Map from './Map';
import {getObject} from '../../common/common';
import ModalWithDrag from '../ModalWithDrag';
import NumberInput from '../NumberInput';

const MAP_PROPS = ['center', 'shape', 'radius', 'address'];

class ElectricFence extends React.Component {
  static propTypes = {
    address: PropTypes.string.isRequired,
    center: PropTypes.object,
    shape: PropTypes.string,
    radius: PropTypes.number,
    onClose: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = getObject(props, MAP_PROPS);
  }

  readonlyProps = (value, width) => {
    return {
      value,
      title: value,
      size: 'small',
      readOnly: true,
      style: {width, marginRight: 10, backgroundColor: '#f0f0f0'},
    }
  };

  radiusProps = () => {
    return {
      defaultValue: this.state.radius || '',
      size: 'small',
      style: {width: 94},
      onChange: (radius) => this.setState({radius: Number(radius) || undefined, shape: radius ? 'circle' : 'none'})
    };
  };

  mapProps = () => {
    return {
      ...this.state,
      height: 500,
      onCenterChange: (center, current) => this.setState({center, current}),
      onPosition: (center) => this.setState({center})
    }
  };

  getProps = () => {
    return {
      title: '电子围栏',
      visible: true,
      width: 910,
      maskClosable: false,
      onOk: () => this.props.onClose(this.state),
      onCancel: () => this.props.onClose()
    };
  };

  render() {
    const center = this.state.center || {lng: '', lat: ''};
    const style = {marginRight: 2};
    return (
      <ModalWithDrag {...this.getProps()}>
        <div style={{marginBottom: 5}}>
          <span style={style}>地址/城市</span>
          <Input {...this.readonlyProps(this.state.address, 180)} />
          <span style={style}>当前地址</span>
          <Input {...this.readonlyProps(this.state.current || '', 180)} />
          <span style={style}>经度</span>
          <Input {...this.readonlyProps(center.lng, 90)} />
          <span style={style}>纬度</span>
          <Input {...this.readonlyProps(center.lat, 90)} />
          <span style={style}>半径(米)</span>
          <NumberInput {...this.radiusProps()} />
        </div>
        <Map {...this.mapProps()} />
      </ModalWithDrag>
    );
  }
}

export default ElectricFence;
