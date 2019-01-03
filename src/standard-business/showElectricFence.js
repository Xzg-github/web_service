import showPopup from './showPopup';
import {ElectricFence} from '../components';

class Fence {
  constructor(addressKey='address') {
    this.addressKey = addressKey;
  }

  getSaveData = (obj) => {
    return {
      longitude: obj.center ? obj.center.lng : '',
      latitude: obj.center ? obj.center.lat : '',
      fenceShape: obj.shape === 'circle' ? 'circle' : 'none',
      fenceRadius: obj.shape === 'circle' ? obj.radius : ''
    };
  };

  getEmptyData = (address) => {
    return {
      [this.addressKey]: address,
      longitude: '',
      latitude: '',
      fenceShape: 'none',
      fenceRadius: '',
    };
  };

  getProps = (obj) => {
    return {
      center: (obj.longitude && obj.latitude) ? {lng: obj.longitude, lat: obj.latitude} : undefined,
      address: obj[this.addressKey],
      shape: obj.fenceShape === 'circle' ? 'circle' : 'none',
      radius: Math.round(Number(obj.fenceRadius))
    };
  };

  show = (props) => {
    return showPopup(ElectricFence, props);
  };

  async showEx(value) {
    const result = await this.show(this.getProps(value));
    return result ? this.getSaveData(result) : result;
  };
}

export default Fence;
