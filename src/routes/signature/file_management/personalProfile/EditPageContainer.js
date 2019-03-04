import {connect} from 'react-redux';
import {getPathValue} from '../../../../action-reducer/helper';
import EditPage from './EditPage';

const STATE_PATH =  ['personalProfile'];

let currentKey;

const getSelfState = (rootState) => {
  const parent = getPathValue(rootState, STATE_PATH);
  currentKey = parent.activeKey;
  return parent[currentKey];
};

const closeActionCreator = (props) => () => {
  props.onTabClose(currentKey);
};

const toolbarActions = {
  close: closeActionCreator,
};


const clickActionCreator = (props, key) => {
  if (toolbarActions.hasOwnProperty(key)) {
    return toolbarActions[key](props);
  } else {
    console.log('unknow key:', key);
    return {type: 'unknown'};
  }
};

const actionCreators = {
  onClick: clickActionCreator,
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

export default connect(mapStateToProps, actionCreators)(EditPage);
