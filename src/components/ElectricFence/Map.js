import React, {PropTypes} from 'react';
import create2 from './LocationControl';
import helper from '../../common/common';

const BAIDU_AK = 'iX2MgjEUZUDwNWzKlEv6ScbK';

const getPoint = async (address) => {
  const url = `/api/proxy/${BAIDU_AK}/${address}`;
  const json = await helper.fetchJson(url);
  if (json.returnCode === 0) {
    const x = json.result.x / 100;
    const y = json.result.y / 100;
    return new BMap.MercatorProjection().pointToLngLat(new BMap.Pixel(x, y));
  } else {
    return null;
  }
};

const createScript = (id, url) => {
  return new Promise(resolve => {
    if (document.getElementById(id)) {
      resolve('ok');
    } else {
      const script = document.createElement('script');
      script.id = id;
      script.src = url;
      script.onload = () => resolve('ok');
      document.body.appendChild(script);
    }
  });
};

const toBmapPoint = (point) => {
  return new BMap.Point(point.lng, point.lat);
};

const loadMapScript = (onLoad) => {
  const url1 = `http://api.map.baidu.com/getscript?v=2.0&ak=${BAIDU_AK}`;
  const url2 = 'http://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.js';
  createScript('BMap', url1).then(() => {
    return createScript('BMapLib', url2);
  }).then(() => {
    onLoad();
  });
};

const styleOptions = {
  strokeColor:"#2196f3",  // 边线颜色。
  fillColor:"#2196f3",    // 填充颜色。当参数为空时，圆形将没有填充效果。
  strokeWeight: 2,        // 边线的宽度，以像素为单位。
  strokeOpacity: 0.8,     // 边线透明度，取值范围0 - 1。
  fillOpacity: 0.4,       // 填充的透明度，取值范围0 - 1。
  strokeStyle: 'solid'    // 边线的样式，solid或dashed。
};

class Map extends React.Component {
  static propTypes = {
    height: PropTypes.any.isRequired,
    address: PropTypes.string.isRequired,
    center: PropTypes.object,
    radius: PropTypes.number,
    shape: PropTypes.oneOf(['none', 'circle']),
    onCenterChange: PropTypes.func,
    onPosition: PropTypes.func
  };

  createLocationControl = (marker) => {
    const LocationControl = create2(BMap);
    return new LocationControl(marker, {
      anchor: BMAP_ANCHOR_BOTTOM_LEFT,
      offset: new BMap.Size(12, 60),
    });
  };

  onMarkerChange = (point) => {
    this.geo.getLocation(point, (result) => {
      const address = result ? result.address : '';
      this.props.onCenterChange(point, address);
    });
  };

  drawMarker = () => {
    if (this.props.center && !this.marker) {
      this.marker = new BMap.Marker(toBmapPoint(this.props.center), {enableDragging: true});
      this.marker.addEventListener('dragend', ({point}) => this.onMarkerChange(point));
      this.map.addOverlay(this.marker);
      this.map.addControl(this.createLocationControl(this.marker));
    }
  };

  removeCircle = () => {
    if (this.circle) {
      this.map.removeOverlay(this.circle);
      this.circle = null;
    }
  };

  drawCircle = () => {
    const {shape, center, radius} = this.props;
    if (center && shape === 'circle') {
      this.circle = new BMap.Circle(toBmapPoint(center), radius, styleOptions);
      this.map.addOverlay(this.circle);
    }
  };

  setCenter = () => {
    if (!this.hasCenter) {
      this.hasCenter = true;
      if (this.circle) {
        this.map.setViewport(this.circle.getBounds());
      } else if (this.props.center) {
        this.map.centerAndZoom(toBmapPoint(this.props.center), 11);
      } else {
        this.map.centerAndZoom(this.props.address || '深圳市', 11);
      }
    } else if (this.circle) {
      this.map.setViewport(this.circle.getBounds());
    }
  };

  // 定位：确定address的经纬度
  position = () => {
    const {center, address, onPosition} = this.props;
    return new Promise(resolve => {
      if (center) {
        resolve(false);
      } else {
        getPoint(address).then(point => {
          point && onPosition(point);
          resolve(!!point);
        });
      }
    });
  };

  componentDidMount() {
    loadMapScript(async () => {
      this.map = new BMap.Map("map");
      this.map.enableScrollWheelZoom(true);
      this.map.addControl(new BMap.MapTypeControl());
      this.map.addControl(new BMap.NavigationControl());
      this.geo = new BMap.Geocoder();
      if (!await this.position()) {
        this.drawMarker();
        this.drawCircle();
        this.setCenter();
      }
    });
  }

  componentDidUpdate() {
    this.drawMarker();
    this.removeCircle();
    this.drawCircle();
    this.setCenter();
  }

  render() {
    return (
      <div style={{height: this.props.height, border: '1px solid #d9d9d9'}}>
        <div id='map' style={{height: '100%'}} />
      </div>
    );
  }
}

export default Map;
