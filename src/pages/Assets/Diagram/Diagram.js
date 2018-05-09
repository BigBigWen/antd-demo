import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import $ from 'jquery';
import { ReactSVGPanZoom, TOOL_PAN } from 'react-svg-pan-zoom';
import io from 'socket.io-client';
import { Tabs, Button, Icon, Spin, Tooltip } from 'antd';
const TabPane = Tabs.TabPane;
import { changeTreeSiteId } from 'actions/tree';
import ProjectSelect from 'components/Hoc/ProjectSelect';
import SVGInline from 'react-svg-inline';
import { SystemModal, SystemAlarmModal } from './components';
import { getValueLabel, sortPoints } from './lib';
import './Diagram.less';
import alarmIcon from 'media/img/alarmIcon.png';
import deviceIcon from 'media/img/deviceIcon.png';
import { TableEventTypeOptions, AlarmLevel } from 'constants/const';
import NotFound from 'components/UI/NotFound';
import API from 'rest/Assets/Diagram';
const {
  loadSites,
  loadProjects,
  getCitcuitPoints,
  getDiagram,
  loadRecordLabour
} = API;

let socket;

const hasMoved = (x1, y1, x2, y2) =>
  (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2) > 25;

const switchName = [
  '.point-c-switch-',
  '.point-c-earthing-switch-',
  '.point-c-switch-capacitor-1-',
  '.point-c-switch-capacitor-2-',
  '.point-c-earthing-switch-capacitor-1-',
  '.point-c-earthing-switch-capacitor-2-',
  '.point-c-contact-',
  '.point-c-contact-transformer-',
  '.point-c-contact-surge-diverter-',
  '.point-c-contact-transformer-surge-diverter-'
];

class Diagram extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sites: [],
      activeKey: this.props.siteId || 0,
      loading: false,
      modalState: false,
      alarmModalState: false,
      telemeter: [],
      yaoXin: [],
      circuitDes: {},
      alarmParameter: [],
      circuitsPoints: []
    };
    this.subscibePoint = [];
    this.subscibeRect = [];
    this.refreshPoint = [];
    this.cancelModal = this.cancelModal.bind(this);
    this.canceAlarmlModal = this.canceAlarmlModal.bind(this);
    this.loadAlarmModal = this.loadAlarmModal.bind(this);
    this.emitCircuit = this.emitCircuit.bind(this);
  }

  componentDidMount() {
    setInterval(this.resetChartData, 5000);
    socket = io.connect();
    socket.on('point-value-event', msg => {
      this.clearChartData(msg);
      this.updateChartData(msg);
      this.updateModalData(msg);
    });
    socket.on('circuit-record', msg => {
      (msg || []).forEach(item => {
        if (!item.alarm) {
          $(`.point-alarm-${item.id}`).css('display', 'none');
        } else {
          $(`.point-alarm-${item.id}`).css('display', 'block');
        }
      });
    });
    socket.on('error', () => socket.open());
    window.onresize = () => {
      $(`#diagram${this.state.activeKey}`)[0].children[0].style.width =
        document.body.offsetWidth - 40 + 'px';
      $(
        `#diagram${this.state.activeKey}`
      )[0].children[0].children[0].style.width =
        document.body.offsetWidth - 40 + 'px';
      $(`#diagram${this.state.activeKey}`)[0].children[0].style.height =
        document.body.offsetHeight - 261 + 'px';
      $(
        `#diagram${this.state.activeKey}`
      )[0].children[0].children[0].style.height =
        document.body.offsetHeight - 261 + 'px';
    };
  }

  componentWillUnmount() {
    socket.close();
    window.onresize = null;
  }
  emitCircuit(siteId) {
    socket.emit('circuit-record-site-subscribe', { id: siteId });
  }
  startLoading = () => {
    this.setState({ loading: true });
  };
  endLoading = () => {
    this.setState({ loading: false });
  };
  cancelModal() {
    this.setState({ modalState: false });
  }
  canceAlarmlModal() {
    this.setState({
      alarmModalState: false
    });
  }
  loadCircuitModal = async data => {
    const json = await getCitcuitPoints(data.slice(8));
    socket.emit('subscribe-point-value-event', { key: json.subscibePoints });
    this.setState({
      modalState: true,
      circuitsPoints: json.circuitsPoints,
      telemeter: json.circuitsPoints,
      yaoXin: json.circuitsPoints
    });
  };
  loadAlarmModal(data) {
    this.setState({ loading: true });
    loadRecordLabour(data.slice(12)).then(res => {
      this.setState({
        alarmModalState: true,
        loading: false,
        alarmParameter: (res.content || []).map(item => {
          item.eventType = (
            TableEventTypeOptions.find(data => data.value === item.eventType) ||
            {}
          ).label;
          item.level = (
            AlarmLevel.find(data => data.value === item.level) || {}
          ).label;
          item.appearDataValue = getValueLabel(
            parseFloat(item.appearDataValue),
            2
          );
          return item;
        })
      });
    });
  }
  updateModalData(msg) {
    let popPoint = [...this.state.circuitsPoints];
    msg.forEach(item => {
      let index = popPoint.findIndex(data => data.key === item.key);
      if (index > -1) {
        popPoint[index].value = item.value;
        popPoint[index].ts = item.ts;
      } else {
        popPoint.push(item);
      }
    });
    let temp = (popPoint[0] || {}).circuit;
    let yaoceArr = popPoint.filter(point => point.pointType === '遥测');
    let yaoxinArr = popPoint.filter(point => point.pointType === '遥信');
    this.setState({
      circuitDes: temp ? { name: temp.name, id: temp.id } : {},
      telemeter: sortPoints(
        [...yaoceArr].map(item => {
          return {
            description: item.description,
            value: item.value,
            ts: item.ts,
            type: item.type,
            pointType: item.pointType
          };
        })
      ),
      yaoXin: sortPoints(
        [...yaoxinArr].map(item => {
          return {
            description: item.description,
            value: item.value,
            ts: item.ts,
            type: item.type,
            pointType: item.pointType
          };
        })
      )
    });
  }
  resetChartData = () => {
    let len = this.refreshPoint.length;
    let randomNum = Math.floor(Math.random() * (len > 20 ? 20 : len));
    for (let i = 0; i < len; i++) {
      i % randomNum === 0 &&
        $('.point-text-' + this.refreshPoint[i].key).html('');
    }
    this.updateChartData(this.refreshPoint);
  };
  clearChartData(msg) {
    msg.forEach(item => {
      let pointIndex = this.refreshPoint.find(data => data.key === item.key);
      if (pointIndex > 0) {
        this.refreshPoint[pointIndex].value = item.value;
      } else {
        this.refreshPoint.push(item);
      }
      $('.point-text-' + item.key).html('');
    });
  }
  updateChartData(data) {
    setTimeout(() => {
      data.forEach(item => {
        $('.point-text-' + item.key).html(getValueLabel(item.value, 2));
        !!this.subscibeRect.length &&
          this.subscibeRect.forEach(point => {
            if (point === item.key) {
              switchName.map(switchType =>
                $(switchType + point).addClass(
                  item.value === 0 ? 'styleB-value' : 'styleC-value'
                )
              );
            }
          });
      });
    }, 300);
  }
  handleSiteChange = siteId => {
    this.setState({ activeKey: siteId });
    this.props.changeTreeSiteId(siteId);
  };
  onProjectChange = async id => {
    let sites = await loadSites({ projectId: id });
    this.setState({ sites: sites });
    !!sites[0] && this.handleSiteChange(sites[0].id);
  };
  render() {
    const { sites, activeKey, loading } = this.state;
    return (
      <div className="page-diagram">
        <div className="project-search-container">
          <div className="project-search">
            <ProjectSelect changeProject={this.onProjectChange} />
          </div>
        </div>
        {!!sites.length ? (
          <div className="diagram-container">
            <Tabs activeKey={`${activeKey}`} onChange={this.handleSiteChange}>
              {sites.map(site => (
                <TabPane tab={site.name} key={`${site.id}`}>
                  <Spin spinning={loading} size="large">
                    <SvgContainer
                      ind={`${site.id}`}
                      site={site.id}
                      emitCircuit={this.emitCircuit}
                      loadCircuitModal={this.loadCircuitModal}
                      loadAlarmModal={this.loadAlarmModal}
                      startLoading={this.startLoading}
                      endLoading={this.endLoading}
                    />
                  </Spin>
                </TabPane>
              ))}
            </Tabs>
            <Link to={`/assets/alarm`}>
              <div className="wifi">
                <Tooltip title="报警列表">
                  <img src={alarmIcon} />
                </Tooltip>
              </div>
            </Link>
            <Link to={`/assets/alarm`}>
              <div className="alarm">
                <Tooltip title="设备在线情况">
                  <img src={deviceIcon} />
                </Tooltip>
              </div>
            </Link>
          </div>
        ) : (
          <NotFound />
        )}
        <SystemModal
          state={this.state.modalState}
          cancel={this.cancelModal}
          circuit={this.state.circuitDes}
          telemetryData={this.state.telemeter} // 遥测
          telecommandData={this.state.yaoXin} // 遥信
        />
        <SystemAlarmModal
          state={this.state.alarmModalState}
          cancel={this.canceAlarmlModal}
          data={this.state.alarmParameter}
        />
      </div>
    );
  }
}
const mapStateToProps = state => ({
  projectId: state.tree.projectId,
  siteId: state.tree.siteId
});

const mapDispatchToProps = dispatch => {
  return {
    changeTreeSiteId: id => dispatch(changeTreeSiteId(id))
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Diagram)
);

class SvgContainer extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      height: 0,
      width: 0,
      SvgDom: ''
    };
    this.Viewer = null;
  }
  componentDidMount(site) {
    this.loadData(this.props.site);
  }
  loadData = async site => {
    if (site !== undefined) {
      socket.emit('stop-subscribe-point-value-event', {
        key: this.subscibePoint
      });
      socket.emit('stop-subscribe-point-value-event', {
        key: this.subscibeRect
      });
      this.props.startLoading();
      let json = await getDiagram(site);
      this.props.endLoading();
      if (json.svg) {
        this.subscibePoint = json.text || [];
        this.subscibeRect = json.rect || [];
        socket.emit('subscribe-point-value-event', {
          key: this.subscibePoint
        });
        socket.emit('subscribe-point-value-event', {
          key: this.subscibeRect
        });

        let parser = new DOMParser();
        let doc = parser.parseFromString(json.svg, 'image/svg+xml');
        this.setState({
          width: doc.children[0].width.baseVal.value,
          height: doc.children[0].height.baseVal.value,
          SvgDom: doc.children[0].innerHTML
        });
        this.viewer.changeTool(TOOL_PAN);
        this.props.emitCircuit(site);

        $("svg[id*='circuit']")
          .css({ 'pointer-events': 'bounding-box', cursor: 'pointer' })
          .mouseup(e => {
            if (hasMoved(this.startX, this.startY, e.clientX, e.clientY)) {
              return;
            }
            this.props.loadCircuitModal(e.currentTarget.id);
          })
          .attr('title', '查看回路数据');
        $("svg[id*='point-alarm']")
          .css('cursor', 'pointer')
          .mouseup(e => {
            if (hasMoved(this.startX, this.startY, e.clientX, e.clientY)) {
              return;
            }
            this.props.loadAlarmModal(e.currentTarget.id);
          })
          .attr('title', '报警列表');
        $('button[name$="unselect-tools"]').addClass('cssname');
        $('button[name$="select-tool-pan"]').attr('title', '拖动工具');
        $('button[name$="select-tool-zoom-in"]').attr('title', '放大工具');
        $('button[name$="select-tool-zoom-out"]').attr('title', '缩小工具');
        $('button[name$="fit-to-viewer"]').attr('title', '全局工具');
        $('div[role$="toolbar"]').addClass('toolbar');
      }
    }
  };

  render() {
    const { ind } = this.props;
    const { height, width, SvgDom } = this.state;
    return (
      <div id={`diagram${ind}`} className="diagram">
        <ReactSVGPanZoom
          width={document.body.offsetWidth - 40}
          height={document.body.offsetHeight - 261}
          background="#f6f8fa"
          detectAutoPan={false}
          miniaturePosition="right"
          ref={viewer => (this.viewer = viewer)}
        >
          <svg height={height} width={width}>
            <SVGInline
              svg={SvgDom}
              component="svg"
              style={{ overflow: 'visible' }}
            />
          </svg>
        </ReactSVGPanZoom>
      </div>
    );
  }
}
