import React from 'react';
import moment from 'moment';
import { Tabs } from 'antd';
import TreeTableFactory from 'components/Hoc/TreeTabTableFactory';
import { BaseProject, TabPaneForm, BaseGroup } from './TabPaneCom';
import API from 'rest/Energy/EPStatistics';
const TabPane = Tabs.TabPane;
const {
  loadEPBaseCompany,
  loadEPDataEnergy,
  loadProjects,
  loadEPBaseProject
} = API;
const param = {
  query: {
    tsStart: moment()
      .startOf('day')
      .valueOf(),
    tsEnd: moment()
      .endOf('day')
      .valueOf(),
    aggrby: 'H',
    pointCategory: 'EP',
    name: 'EP',
    aggrLevel: 'project',
    aggrLevelKey: null,
    type: 'circuit'
    // groupId: this.props.groupId 父组件传
  },
  tabs: {
    showTabPane: true,
    tabArr: [
      {
        Component: BaseProject,
        getAction: loadEPDataEnergy,
        name: '回路',
        key: 'circuit',
        aggrLevel: 'project'
      },
      {
        Component: BaseProject,
        getAction: loadEPDataEnergy,
        name: '计费进线',
        key: 'measurement',
        aggrLevel: 'project'
      },
      {
        Component: BaseGroup,
        getAction: loadEPBaseProject,
        name: '项目',
        key: 'project',
        aggrLevel: 'group'
      },
      {
        Component: BaseGroup,
        getAction: loadEPBaseCompany,
        name: '公司',
        key: 'group',
        aggrLevel: 'group'
      },
      {
        Component: TabPaneForm,
        getAction: () => ({ data: [] }),
        name: '统计报表',
        key: 'statistics'
      }
    ]
  }
};
class EPStatisticsCom extends React.Component {
  state = {
    projects: []
  };
  componentDidMount() {
    this.onLoadProjects();
  }
  onLoadProjects = async () => {
    const projects = await loadProjects();
    this.setState({
      projects
    });
  };
  onChangeActiveKey = activeKey => {
    let currentTab = this.props.tabsData.find(tab => tab.key === activeKey);
    this.props.changeActiveKey({
      activeKey,
      aggrLevel: currentTab.aggrLevel,
      type: currentTab.key
    });
  };
  render() {
    const {
      query,
      tabsActiveKey,
      tabsData,
      changeActiveKey,
      onFilterChange,
      data,
      loading
    } = this.props;
    const { projects } = this.state;
    return (
      <div className="page-ep-statistics">
        <Tabs activeKey={tabsActiveKey} onChange={this.onChangeActiveKey}>
          {tabsData.map(tab => {
            const Com = tab.Component;
            return (
              <TabPane tab={tab.name} key={tab.key}>
                <Com
                  onFilterChange={onFilterChange}
                  chartData={data.chartData || []}
                  tableData={data.tableData || []}
                  tabKey={tab.key}
                  query={query}
                  projects={projects}
                />
              </TabPane>
            );
          })}
        </Tabs>
      </div>
    );
  }
}
export default TreeTableFactory(param)(EPStatisticsCom);
