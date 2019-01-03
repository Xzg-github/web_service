/*
 state结构如下：
  {
    edit,
    activePart,
    keys,
    key1(key2,key3等等),
  }
 */

const toEditState = (data={}, config, edit) => {
  const {keys} = config;
  const {children = {}, ...basic} = data;
  const state = {...config, edit, activePart: keys[0]};
  return keys.reduce((state, key, index) => {
    state[key] = index === 0 ? (basic || {}) : (children[key] || []);
    return state;
  }, state);
};

export {toEditState};
