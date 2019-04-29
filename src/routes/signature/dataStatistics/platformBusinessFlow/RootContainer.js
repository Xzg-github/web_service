import { connect } from 'react-redux';
import OrderPageContainer from './OrderPageContainer';
import {EnhanceLoading} from '../../../../components/Enhance';
import {Action} from '../../../../action-reducer/action';
import {getPathValue} from '../../../../action-reducer/helper';
import {buildOrderPageState} from '../../../../common/state';
import helper, {fetchJson, getJsonResult} from '../../../../common/common';
import {search} from '../../../../common/search';

const STATE_PATH = ['platformBusinessFlow'];
const action = new Action(STATE_PATH);

const urlConfig = '/api/signature/dataStatistics/platformBusinessFlow/config';
const urlList =  '/api/signature/dataStatistics/enterpriseBusinessFlow/list';

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};


const initActionCreator = () => async (dispatch) => {
  try {
    dispatch(action.assign({status: 'loading'}));
    const {index} = getJsonResult(await fetchJson(urlConfig));
    const list = getJsonResult(await search(urlList, 0, index.pageSize, {}));
    const payload = buildOrderPageState(list, index, {status: 'page'});
    dispatch(action.create(payload));
  } catch (e) {
    helper.showError(e.message);
    dispatch(action.assign({status: 'retry'}));
  }
};

const mapStateToProps = (state) => {
  return helper.getObject(getSelfState(state), ['status']);
};

const actionCreators = {
  onInit: initActionCreator
};

const Component = EnhanceLoading(OrderPageContainer);
export default connect(mapStateToProps, actionCreators)(Component);
