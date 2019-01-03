import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './TrackLine.less';
import helper, {postOption, fetchJson, showError, showSuccessMsg} from '../../common/common';

class TrackLine extends React.Component {
  static propTypes = {
    width: PropTypes.number,
    data: PropTypes.array,
    emptyContent: PropTypes.string,
    hasOrderNumber:PropTypes.bool,
    activeNode: PropTypes.string,
    switchNode: PropTypes.func
  };

  constructor(props) {
    super(props);
  }

  color = {
    '1': '#3DA831',
    '2': '#B73533',
    '3': '#E9EA07',
    '0': '#D2D2D2'
  };

  renderTrackDotType = (item) => {
    const {hasOrderNumber,switchNode} = this.props;
    if(hasOrderNumber){
      return (
        <div className={s.bgDot} onClick={switchNode.bind(this,item)}>{item.sequence}</div>
      );
    }else{
      return (
        <div className={s.trackline_dot_head} style={{ border: `2px solid${this.color[item.lifecyleStatus || '0']}` }} >
          <div className={s.trackline_dot_headCenter} style={{ backgroundColor: this.color[item.lifecyleStatus || '0'] }} />
        </div>
      );
    }
  };

  renderTrackDot = (item, index) => {
    const {hasOrderNumber,activeNode} = this.props;
    return (
      <li key={index} className={s.trackline_dot}>
        <div className={s.trackline_dot_tail} style={{ borderTop: `2px solid ${this.color[item.lifecyleStatus || '0']}`}}/>
        {this.renderTrackDotType(item)}
        <div className={s.trackline_dot_info}>
          <div className={(item.id==activeNode && hasOrderNumber)?s.activeBgDot:''}>{item.lifecycleName}</div>
        </div>
      </li>
    );
  };

  renderTrackLine = (trackData, count = 0, TrackIndex = 0, TrackCount = 1, nextTrack = null) => {
    const marginLeft = count > 0 ? 55 : 0;
    const nextTrackStauts = nextTrack ? (nextTrack[0] ? nextTrack[0].lifecyleStatus : null) : null;
    return (
      <ul key={TrackIndex} className={s.trackline}
        style={{
          marginLeft: `${count * 110 + marginLeft}px`,
          borderLeft: `${TrackIndex + 1 === TrackCount || TrackCount === 1 ? '0px': '2px'} solid ${this.color[nextTrackStauts || '0']}`
        }}>
          {trackData.map((item, index) => this.renderTrackDot(item, index))}
      </ul>
    );
  };

  renderTrackInfo = (data, width) => {
    return  (
      <div className={s.root} style={{width: width +'px'}}>{this.renderTrackLine(data)}</div>
    );
  };

  renderNoTrackTip = () => {
    return (
      <div className={s.noTrackTip}>{this.props.emptyContent}</div>
    );
  };

  render() {
    const { data, width } = this.props;
    return data.length > 0 ? this.renderTrackInfo(data, width) : this.renderNoTrackTip();
  }
}

const buildTrackLineProps = async (params) => {
  const URL = "/api/basic/tenantLifecycle/lifecyclelist";
  const {returnCode, result, returnMsg} = await fetchJson(`${URL}/${params.searchData.taskUnitTypeName.value}`, 'get');
  params.data = result;
  return Object.assign({},params);
};

export default withStyles(s)(TrackLine);
export {buildTrackLineProps};
