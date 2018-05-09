import React from 'react';
import { Spin, Row } from 'antd';
import { withRouter } from 'react-router-dom';
import Tree from 'components/Tree/Tree';
import moment from 'moment';
import API from 'rest/Energy/EnergyAnalysis';
import MeasurementData from './components/MeasurementData';
import EnergyFactory from './components/EnergyFactory';
import { tabs } from './const';
import './Analysis.less';

const { loadTreeData } = API;

class EnergyCom extends React.Component {
  changeTreeItem = obj => {
    this.props.onFilterChange({
      aggrLevel: Object.keys(obj)[0],
      aggrLevelKey: Object.values(obj)[0][0]
    });
  };
  render() {
    const {
      query,
      tabs,
      activeKey,
      onFilterChange,
      onTabChange,
      data,
      loading
    } = this.props;

    return (
      <div className="page-energy-analysis">
        <Tree
          onFilterChange={this.changeTreeItem}
          loadData={loadTreeData}
          style={{ marginRight: 8 }}
          enableMulti={false}
        />
        <div className="right-container">
          <Spin spinning={loading}>
            <MeasurementData
              query={query}
              tabs={tabs}
              activeKey={activeKey}
              onFilterChange={onFilterChange}
              onTabChange={onTabChange}
              data={data}
            />
          </Spin>
        </div>
      </div>
    );
  }
}

const EnergyAnaysis = EnergyFactory({
  query: {
    tsStart: moment()
      .startOf('day')
      .valueOf(),
    tsEnd: moment()
      .endOf('day')
      .valueOf(),
    aggrLevel: 'measurement',
    aggrLevelKey: null,
    aggrby: 'H'
  },
  tabs: tabs
})(EnergyCom);

export default withRouter(EnergyAnaysis);
