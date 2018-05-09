import React from 'react';
import { Map, Markers, InfoWindow } from 'react-amap';
import { largeNum } from 'lib/helper';
import './Map.less';

const dynamicAlerting = (event, change) => {
  switch (event) {
    case 'APPEAR':
      return <div className="text-red text-disappear">新报警 +1</div>;
    case 'DISAPPEAR':
      return <div className="text-green text-disappear">报警恢复 ×1</div>;
    case 'READ':
      return <div className="text-green text-disappear">报警确认 ×1</div>;
    case '功率':
      return <div className="text-blue text-disappear">{change}kW</div>;
    default:
      return null;
  }
};

export default class MapWrapper extends React.Component {
  state = {
    position: {},
    selectedProjectId: null
  };

  // 将selectedProjectId交给父组件控制遇到了InfoWindow打不开的问题，暂时内部外部各维护一个吧
  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedProjectId !== this.state.selectedProjectId) {
      const { selectedProjectId, markers } = nextProps;
      const target =
        markers.find(i => `${i.id}` === `${selectedProjectId}`) || {};
      const position = {
        longitude: target.longitude,
        latitude: target.latitude
      };
      this.setState({
        selectedProjectId,
        position
      });
    }
  }

  onMapClick = () => {
    this.setState({ selectedProjectId: null });
    this.props.handleMapClick();
  };

  onMarkerClick = event => {
    let project = event.target.getExtData();
    this.setState(
      {
        selectedProjectId: project.extData.id,
        position: project.position
      },
      () => {
        this.props.handleMarkerClick(this.state.selectedProjectId);
      }
    );
  };

  render() {
    const {
      markers,
      theme,
      handleMapClick,
      handleMarkerClick,
      infoData
    } = this.props;
    const { position, selectedProjectId } = this.state;
    const target =
      markers.find(i => `${i.id}` === `${selectedProjectId}`) || {};
    return (
      <div className={`map-wrapper ${theme}`}>
        <Map
          amapkey={'dfdf7f04eac7a930ba21361c4a3887cd'}
          events={{
            click: this.onMapClick,
            created: ins => (this._map = ins),
            complete: () => this._map.setFitView()
          }}
          center={position}
          mapStyle={`amap://styles/${theme}`}
        >
          <Markers
            markers={markers.map(project => ({
              position: {
                longitude: project.longitude,
                latitude: project.latitude
              },
              extData: project
            }))}
            events={{ click: this.onMarkerClick }}
            render={marker => {
              const color = marker.extData.color || 'ALL_DISAPPEAR';
              return (
                <div className="marker">
                  {dynamicAlerting(marker.extData.event, marker.extData.change)}
                  <div
                    className={color
                      .toLowerCase()
                      .split('_')
                      .join('-')}
                  />
                </div>
              );
            }}
          />
          <InfoWindow
            position={position}
            visible={!!selectedProjectId}
            isCustom
          >
            <div className={`info-window ${theme}`}>
              <a
                className="title"
                href={`/energy/energy-overview/${selectedProjectId}`}
                onClick={() => console.log(selectedProjectId)} // 全局缓存这个id
              >
                {target.name}
              </a>
              <div className="address">{`${target.province ||
                ''} ${target.city || ''}`}</div>
              <div className="address">{target.address}</div>
              <ul className="list">
                <li className="item">
                  <span className="label">电量</span>
                  <span className="value">{largeNum(infoData.epM)} kWh</span>
                </li>
                <li className="item">
                  <span className="label">功率</span>
                  <span className="value">{largeNum(infoData.p)} kW</span>
                </li>
                <li className="item">
                  <span className="label">未确定报警</span>
                  <span className="value">
                    {largeNum(infoData.onlyAppearUnread)}
                  </span>
                </li>
                <li className="item">
                  <span className="label">未恢复报警</span>
                  <span className="value">{largeNum(infoData.onlyAppear)}</span>
                </li>
              </ul>
            </div>
          </InfoWindow>
        </Map>
      </div>
    );
  }
}
