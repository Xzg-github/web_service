/**
 * (不修改原数组) 交换对象数组的两列，对象中必须有key属性
 */
const swapItems = ([...arr], key1, key2) => {
  const index1 = arr.findIndex(item => item.key == key1);
  const index2 = arr.findIndex(item => item.key == key2);
  const item = arr[index1];
  arr[index1] = arr[index2];
  arr[index2] = item;
  return arr;
};

/**
 * (不会修改原对象) 为对象的关键路径赋值，且在关键路径上遇到的每个对象都会生成一个新的对象
 * value：赋予的新值，必须是一个对象
 * keyPath：不定参数，用于指定关键路径，路径中的每一个key(字符串)都是对象中的属性，如果指定的key不存在则会创建
 */
const deepAssign = (obj, value, ...keyPath) => {
  let {...newObj} = obj;
  let last = keyPath.reduce((state, key) => {
    ({...state[key]} = state[key] || {});
    return state[key];
  }, newObj);
  Object.assign(last, value);
  return newObj;
};

/**
 * 获取对象关键路径的值，不存在则返回undefined
 */
const getValue = (obj, ...keyPath) => {
  let value = obj;
  for (const key of keyPath) {
    if (!keyPath || typeof value !== 'object') {
      return
    } else {
      value = value[key];
    }
  }
  return value;
};

/**
 * 返回值：返回reducer函数，该reducer会依据keyReducer的返回值调用指定keys下的reducer
 * keyReducer: 函数，原型为func(state, action)，返回值为包含keys和reducer的对象
 */
const mapReducer = (keyReducer) => {
  return (state, action) => {
    const {keys, reducer} = keyReducer(state, action);
    if (keys && typeof reducer === 'function') {
      const preState = getValue(state, ...keys);
      const newState = typeof preState !== 'object' ? preState : reducer(preState, action);
      if (preState !== newState) {
        return deepAssign(state, newState, ...keys);
      }
    }
    return state;
  }
};

/**
 * 返回值：返回reducer函数，类似于redux中combineReducers返回的reducer
 *  只有state中相应的key存在时才会调用对应的reducer
 * reducers：键值对，key对应为state中的key，value是reducer函数
 */
const combineReducers = (reducers) => {
  const keys = Object.keys(reducers);
  return (state, action) => {
    let preKeyState, newKeyState;
    let newState = {};
    let hasChange = false;

    for (const key of keys) {
      if (state.hasOwnProperty(key)) {
        preKeyState = state[key];
        newKeyState = reducers[key](preKeyState, action);
        newState[key] = newKeyState;
        hasChange = hasChange || preKeyState !== newKeyState;
      }
    }

    return hasChange ? deepAssign(state, newState) : state;
  }
};

/**
 * 返回值：返回reducer，该reducer会依据action type来调用reducer，如果action未能处理则交给nextReducer
 * reducers：键值对，key为action的type，value为reducer函数
 * nextReducer：[可选] reducer函数
 * initState：[可选] 传递给返回reducer的初始状态
 */
const composeReducers = (reducers, nextReducer, initState = {}) => {
  if (typeof nextReducer !== 'function') {
    nextReducer = state => state;
  }

  return (state = initState, action) => {
    if (reducers.hasOwnProperty(action.type)) {
      return reducers[action.type](state, action);
    } else {
      return nextReducer(state, action);
    }
  }
};

export {swapItems, deepAssign, getValue, composeReducers, combineReducers, mapReducer};
