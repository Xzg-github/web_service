import {Action} from '../../../../action-reducer/action';
import {getPathValue} from '../../../../action-reducer/helper';
import createEditPageContainer from './createEditPageContainer';

const STATE_PATH = ['signature_center', 'edit'];
const action = new Action(STATE_PATH);

const getSelfState = (rootState) => {
  const state = getPathValue(rootState, ['signature_center']);
  return state[state.activeKey];
};

const STATE_PARENT = ['signature_center'];
const parentAction = new Action(STATE_PARENT);

const getParentState = (rootState) => {
  return getPathValue(rootState, STATE_PARENT);
};

const Container = createEditPageContainer(action, getSelfState, getParentState);
export default Container;

