import React from 'react';
import { find, sumBy } from 'lodash';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import Cookies from 'js-cookie';
import Event from './lib/Event';
import OverviewAPI from 'rest/Overview';
import { themes } from 'constants/const';
import Map from './components/Map';
import StatData from './components/StatData'; // 右侧数据
import FixData from './components/FixData'; // 左下角数据
import AlarmList from './components/AlarmList'; // 左下角数据
import Project from './components/Project'; // 左下角数据
import AlarmModal from './components/AlarmModal'; //弹窗
const { readRecord, postRecordDisappear, generateTicket } = OverviewAPI;
import './Overview.less';

const { loadProjects } = OverviewAPI;

class Overview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [], // 全部项目
      scrollAlarmList: [], // 滚动的报警列表
      selectedProjectId: null, // 选中项目的id，展示数据有项目自身数据和socket.io数据两部分
      selectedProject: {}, // 选中的项目的socket.io数据
      statData: {}, // 统计数据
      loading: true, // 是否在加载数据,
      modalState: false
    };
    this.audio = document.createElement('audio');
    this.audio.src =
      'http://kf-prod.oss-cn-beijing.aliyuncs.com/audio/alarm.mp3';
    this.audio.loop = 'loop';
  }

  showAlarmModal = () => {
    this.setState({
      modalState: true
    });
  };
  hideAlarmModal = () => {
    this.setState({
      modalState: false
    });
  };

  componentDidMount() {
    this.init();
  }

  init = async () => {
    const token = Cookies.get('token');
    this.socket = io.connect(
      'http://' + window.location.host + '?access_token=' + token
    );
    if (!this.state.projects.length) {
      let projects = await loadProjects({}, i => i);
      this.socket.emit('home_page_switch', { key: {} });
      this.setState({ projects });
    }

    const socketListener = () => {
      // 更新页面左下角的配电房总数、总运行时、总装机容量
      this.socket.on('home_page_fix_data', msg => {
        this.Event.onFixChange(msg);
        this.setState({ statData: this.Event.getData() });
      });
      // 有项目P发生改变
      this.socket.on('home_page_p_change', msg => {
        const change = this.Event.getPChange(msg);
        this.Event.onPChange(msg);
        this.setState({
          projects: this.state.projects.map(item => ({
            ...item,
            event: item.id === msg.id ? '功率' : '',
            change:
              item.id === msg.id
                ? `${change > 0 ? '+' : ''}${change.toFixed(2)}`
                : ''
          })),
          statData: this.Event.getData()
        });
      });
      // 有项目EP发生改变
      this.socket.on('home_page_ep_change', msg => {
        this.Event.onEPChange(msg);
        this.setState({
          statData: this.Event.getData()
        });
      });
      // 有项目报警数发生改变
      this.socket.on('home_page_record_change', msg => {
        this.Event.onRecordChange(msg);
        const stateData = this.Event.getState();
        this.setState({
          projects: this.state.projects.map(item => ({
            ...item,
            event: item.id === msg.projectId ? msg.eventName : '',
            color: (find(stateData, p => p.id === item.id) || {}).type
          })),
          statData: this.Event.getData()
        });
      });
    };
    // 初次获取全部项目的数据
    this.socket.on('home_page_basic', msg => {
      this.Event = new Event(msg);
      const stateData = this.Event.getState();
      this.setState({
        statData: this.Event.getData(),
        projects: this.state.projects.map(item => ({
          ...item,
          color: (find(stateData, p => p.id === item.id) || {}).type
        })),
        loading: false
      });
      socketListener();
    });

    this.socket.on('home_page_record_list', msg => {
      this.setState({ scrollAlarmList: msg.filter(i => !i.ticketId) });
      // msg.length ? this.audio.play() : this.audio.pause();
    });

    this.socket.on('home_page_project', msg =>
      this.setState({ selectedProject: msg })
    );

    this.socket.on('error', err => console.log(err));
  };

  componentWillUnmount() {
    this.socket.close();
    this.audio.pause();
  }

  handleMapClick = () => {
    const { projects } = this.state;
    this.setState({
      projects: projects.map(project => ({
        ...project,
        event: ''
      })),
      selectedProjectId: null
    });
  };

  handleMarkerClick = projectId => {
    const { projects } = this.state;
    this.socket.emit('home_page_project_subscribe', { id: projectId });
    this.setState({
      projects: projects.map(project => ({
        ...project,
        event: '',
        change: ''
      })),
      selectedProjectId: projectId
    });
  };

  render() {
    const {
      projects,
      selectedProject,
      statData,
      scrollAlarmList,
      selectedProjectId,
      modalState,
      loading
    } = this.state;
    const { themeIndex } = this.props;
    const theme = themes[themeIndex];
    return (
      <div className="page-overview">
        <Map
          markers={projects}
          theme={theme}
          infoData={selectedProject}
          handleMapClick={this.handleMapClick}
          handleMarkerClick={this.handleMarkerClick}
          selectedProjectId={selectedProjectId}
        />
        <Project
          theme={theme}
          projects={projects.map(i => ({ value: i.id, label: i.name }))}
          onSelect={projectId =>
            this.setState({ selectedProjectId: projectId })
          }
        />
        <StatData data={statData} theme={theme} loading={loading} />
        <FixData
          data={statData}
          list={scrollAlarmList}
          theme={theme}
          loading={loading}
          style={{ left: scrollAlarmList.length ? 370 : 18 }}
        />
        {!!scrollAlarmList.length && (
          <AlarmList
            data={scrollAlarmList}
            theme={theme}
            showAlarmModal={this.showAlarmModal}
          />
        )}
        <AlarmModal
          state={modalState}
          cancel={this.hideAlarmModal}
          data={scrollAlarmList}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ global }) => ({
  themeIndex: global.theme
});

export default connect(mapStateToProps)(Overview);
