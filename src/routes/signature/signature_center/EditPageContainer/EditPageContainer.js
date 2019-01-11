import {Action} from '../../../../action-reducer/action';
import {getPathValue} from '../../../../action-reducer/helper';
import createEditPageContainer from './createEditPageContainer';

const STATE_PATH = ['signature_center', 'edit'];
const action = new Action(STATE_PATH);

const getSelfState = (rootState) => {
  const state = getPathValue(rootState, ['signature_center']);
  return state[state.activeKey];
};

const Container = createEditPageContainer(action, getSelfState);
export default Container;

