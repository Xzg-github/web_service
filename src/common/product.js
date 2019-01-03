import helper from './common';

const url = '/api/proxy/production_service/productType/service/get_tree_structure';

class Product {
  constructor(serviceKey='serviceCode', businessKey='businessCode', jobUnitKey='taskUnitCode') {
    this.tree = [];
    this.serviceKey = serviceKey;
    this.businessKey = businessKey;
    this.jobUnitKey = jobUnitKey;
  }

  hasTree = () => {
    return !!this.tree.length;
  };

  findServiceItem = (value) => {
    for (const item of this.tree) {
      if (item.value === value) {
        return item;
      }
    }
  };

  findBusinessItem = (service, value) => {
    const sItem = this.findServiceItem(service);
    if (sItem && Array.isArray(sItem.children)) {
      for (const item of sItem.children) {
        if (item.value === value) {
          return item;
        }
      }
    }
  };

  getServiceOptions = () => {
    return this.tree.reduce((options, {value, title}) => {
      options.push({value, title});
      return options;
    }, []);
  };

  getBusinessOptions = (service) => {
    const sItem = this.findServiceItem(service);
    if (sItem && Array.isArray(sItem.children)) {
      return sItem.children.reduce((options, {value, title}) => {
        options.push({value, title});
        return options;
      }, []);
    }
  };

  getJobUnitOptions = (service, business) => {
    const bItem = this.findBusinessItem(service, business);
    if (bItem && Array.isArray(bItem.children)) {
      return bItem.children.reduce((options, {value, title}) => {
        options.push({value, title});
        return options;
      }, []);
    }
  };

  isProductKey = (key) => {
    return this.serviceKey === key || this.businessKey === key || this.jobUnitKey === key;
  };

  getValue = (key, obj) => {
    const value = obj[key];
    if (value && typeof value === 'object') {
      return value.value;
    } else {
      return value;
    }
  };

  async getOptions(key, obj) {
    if (!this.hasTree()) {
      const {returnCode, result} = await helper.fetchJson(url);
      if (returnCode === 0) {
        this.tree = result;
      } else {
        return;
      }
    }

    if (key === this.serviceKey) {
      return this.getServiceOptions();
    } else if (key === this.businessKey) {
      const service = this.getValue(this.serviceKey, obj);
      if (service) {
        return this.getBusinessOptions(service);
      }
    } else if (key === this.jobUnitKey) {
      const service = this.getValue(this.serviceKey, obj);
      const business = this.getValue(this.businessKey, obj);
      if (service && business) {
        return this.getJobUnitOptions(service, business);
      }
    }
  }

  change = (key, value, objValue={}, objOptions={}) => {
    let newValue = {}, newOptions = {};
    if (key === this.serviceKey) {
      newOptions = Object.assign({}, objOptions, {[this.businessKey]: [], [this.jobUnitKey]: []});
      newValue = Object.assign({}, objValue, {[key]: value, [this.businessKey]: '', [this.jobUnitKey]: ''});
    } else if (key === this.businessKey) {
      newOptions = Object.assign({}, objOptions, {[this.jobUnitKey]: []});
      newValue = Object.assign({}, objValue, {[key]: value, [this.jobUnitKey]: ''});
    } else {
      newOptions = objOptions;
      newValue=Object.assign({}, objValue, {[key]: value});
    }
    return {value: newValue, options: newOptions};
  };
}

export default Product;
