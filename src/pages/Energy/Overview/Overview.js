import React from 'react';
import moment from 'moment';
import { Tabs, Progress, Tooltip, Icon } from 'antd';
import './Overview.less';
import API from 'rest/Energy/EnergyOverview';
import Block from './components/Block';
import EPBlock from './components/EPBlock';
import PdmdBlock from './components/PdmdBlock';
import COSQBlock from './components/COSQBlock';
import ScoreBlock from './components/ScoreBlock';
import ProjectSelect from './components/ProjectSelect';
import EPChart from './components/EPChart';
import CircuitChart from './components/CircuitChart';
import CircuitLegend from './components/CircuitLegend';
import PChart from './components/PChart';
import PdmdChart from './components/PdmdChart';
import NotFound from 'components/UI/NotFound';
import { T } from 'antd/lib/upload/utils';
import { notEmptyForChart } from 'lib/helper';

const { loadProjects, loadMeasurements, loadEnergyOverview } = API;
const TabPane = Tabs.TabPane;
const Fragment = React.Fragment;

const getArrFirst = arr => (Array.isArray(arr) && arr[0] ? arr[0].value : null);

export default class Overview extends React.Component {
  state = {
    projects: [],
    measurements: [],
    selectedProject: null,
    selectedMeasurement: null,
    overviewData: {}
  };
  componentDidMount() {
    (async () => {
      let projects = await loadProjects();
      let selectedProject = getArrFirst(projects);
      this.setState({ projects, selectedProject });
      this.loadTabs(selectedProject);
    })();
  }

  onProjectChange = async val => {
    this.loadTabs(val);
    this.setState({ selectedProject: val });
  };

  onMeasurmentChange = async val => {
    const data = await loadEnergyOverview(val);
    this.setState({ selectedMeasurement: val, overviewData: data.data });
  };

  loadTabs = async projectId => {
    if (!projectId) {
      return [];
    }
    let json = await loadMeasurements({ projectId });
    const measurements = json.map(i => ({ value: `${i.id}`, label: i.name }));
    this.setState({ measurements });
    const selectedMeasurement = await getArrFirst(measurements);
    this.onMeasurmentChange(selectedMeasurement);
  };

  render() {
    const now = moment();
    const {
      projects,
      selectedProject,
      measurements,
      selectedMeasurement,
      overviewData
    } = this.state;
    const {
      PData,
      PdmdData,
      circuitData,
      EPData,
      epInMonth,
      epInLastMonth,
      epMoM,
      pdmd,
      currentMonthManualPdmd,
      powerFactorList,
      powerFactor,
      radarData
    } = overviewData;
    return (
      <div className="page-energy-overview">
        {measurements && measurements.length ? (
          <Tabs
            activeKey={selectedMeasurement}
            onChange={this.onMeasurmentChange}
            tabBarExtraContent={
              <ProjectSelect
                onSelect={this.onProjectChange}
                value={selectedProject}
                projects={projects}
              />
            }
          >
            {measurements.map(i => (
              <TabPane tab={i.label} key={i.value}>
                <Fragment>
                  <div className="block-wrapper">
                    <EPBlock last={epInLastMonth} current={epInMonth} />
                    <PdmdBlock
                      type={2}
                      pdmd={pdmd}
                      value={currentMonthManualPdmd}
                    />
                    <COSQBlock COSQ={powerFactor} data={powerFactorList} />
                    <ScoreBlock scores={radarData} />
                  </div>
                  <div className="charts-up-wrapper">
                    <div className="chart-EP">
                      <div className="title">用电量</div>
                      {notEmptyForChart(EPData || []) ? (
                        <EPChart data={EPData} />
                      ) : (
                        <NotFound />
                      )}
                    </div>
                    <div className="chart-circuit">
                      <div className="title">各回路用电占比</div>
                      <div className="pie-chart-container">
                        <div className="pie-chart">
                          <CircuitChart data={circuitData} />
                        </div>
                        <CircuitLegend data={circuitData} />
                      </div>
                    </div>
                  </div>
                  <div className="charts-down-wrapper">
                    <div className="chart-P">
                      <div className="title">用电功率</div>
                      <div className="chart-wrapper">
                        {notEmptyForChart(PData || []) ? (
                          <PChart data={PData} />
                        ) : (
                          <NotFound />
                        )}
                      </div>
                    </div>
                    <div className="chart-Pdmd">
                      <div className="title">本月最大需量</div>
                      <div className="chart-wrapper">
                        {notEmptyForChart(PdmdData || []) ? (
                          <PdmdChart data={PdmdData} />
                        ) : (
                          <NotFound />
                        )}
                      </div>
                    </div>
                  </div>
                </Fragment>
              </TabPane>
            ))}
          </Tabs>
        ) : (
          <div className="notfound-container">
            <div className="project-container">
              <ProjectSelect
                onSelect={this.onProjectChange}
                value={selectedProject}
                projects={projects}
              />
            </div>
            <NotFound />
          </div>
        )}
      </div>
    );
  }
}
