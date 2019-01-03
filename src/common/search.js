import {postOption, fetchJson, showError, convert} from './common';
import {toTableItems} from './orderAdapter';

const buildFilter = (itemFrom, itemTo, filterArg) => {
  const filter = Object.keys(filterArg).reduce((state, key) => {
    if (filterArg[key] !== '') {
      state[key] = filterArg[key];
    }
    return state;
  }, {});
  return {itemFrom, itemTo, filter};
};

const search = async (url, from, to, filter) => {
  const option = postOption(buildFilter(from, to, convert(filter)));
  return await fetchJson(url, option);
};

const search2 = async (dispatch, action, url, currentPage, pageSize, filter, newState={}, path=undefined) => {
  const from = (currentPage - 1) * pageSize;
  const to = from + pageSize;
  const {returnCode, returnMsg, result} = await search(url, from, to, filter);
  if (returnCode === 0) {
    const payload = {
      ...newState,
      tableItems: toTableItems(result),
      maxRecords: result.returnTotalItem
    };
    dispatch(action.assign(payload, path));
  } else {
    showError(returnMsg);
  }
};

const bindSearchAction = (dispatch, actionType) => {
  return async (url, from, to, filters) => {
    const {returnCode, result} = await search(url, from, to, filters);
    if (returnCode === 0) {
      dispatch({type: actionType, result});
    }
  };
};

const bindSearchActionCreator = (getSelfState, url, actionType) => {
  return () => (dispatch, getState) => {
    const search = bindSearchAction(dispatch, actionType);
    const {currentPage, pageSize, searchData} = getSelfState(getState());
    const from = (currentPage - 1) * pageSize;
    const to = from + pageSize;
    return search(url, from, to, searchData);
  };
};

export {search, search2, bindSearchAction, bindSearchActionCreator,buildFilter};
