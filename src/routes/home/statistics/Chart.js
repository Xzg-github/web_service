import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Chart.less';
import {VictoryChart, VictoryArea, VictoryTooltip, VictoryVoronoiContainer, VictoryAxis, VictoryLabel} from 'victory';

const CHART_COLOR = '#999999';
const X_STYLE = {
  axis: {stroke: CHART_COLOR}
};
const Y_STYLE = {
  axis: {stroke: CHART_COLOR},
  grid: {stroke: CHART_COLOR, strokeDasharray: '2,5'},
};
const AREA_STYLE = {
  data: {fill: "#f0f0f0", stroke: '#c8c8c8'},
  labels: { fill: "white"}
};

const FlyOut = ({py, x, y, width, height}) => {
  const originY = 250;
  const left = x - width / 2 - 5;
  const top = py - height / 2;
  return (
    <g className={s.flyout}>
      <rect x={left} y={top} width={width + 10} height={height} rx='5' ry='5' />
      <line x1={x} y1={originY} x2={x} y2={py} />
      <circle cx={x} cy={y + 10} r='3' />
    </g>
  );
};

class Chart extends React.Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    month: PropTypes.number.isRequired
  };

  render() {
    const {month, data} = this.props;
    const y = 30;
    const areaProps = {
      data,
      style: AREA_STYLE,
      labels: (d) => `${month}-${d._x} 订单量 ${d._y}`,
      labelComponent: <VictoryTooltip flyoutComponent={<FlyOut py={y} />} labelComponent={<VictoryLabel y={y}/>}/>
    };
    const chartProps = {
      key: month,
      containerComponent: <VictoryVoronoiContainer voronoiDimension="x"/>,
      domain: {x: [1, 31], y: data.every(({y}) => !y) ? [0, 10] : null}
    };
    return (
      <VictoryChart {...chartProps}>
        <VictoryArea {...areaProps} />
        <VictoryAxis style={X_STYLE} tickValues={[1, 8, 15, 22, 29]} tickFormat={t => `${month}-${t}`}/>
        <VictoryAxis style={Y_STYLE} dependentAxis />
      </VictoryChart>
    );
  }
}

export default withStyles(s)(Chart);
