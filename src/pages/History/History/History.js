import React from 'react';
import { Spin, Row } from 'antd';
import { withRouter } from 'react-router-dom';
import Tree from 'components/Tree/Tree';
import moment from 'moment';
import HistoryFactory from './components/HistoryFactoy';
import API from 'rest/History/HistoryData';
const { loadTreeData, loadHistoryData } = API;
import { tabs } from './config';

import SwitchContext from './components/SwitchContext';
import './History.less';

class HistoryCom extends React.Component {
  changeTreeItem = obj => {
    this.props.onFilterChange({
      aggrLevel: Object.keys(obj)[0],
      aggrLevelKey: Object.values(obj)[0][0],
      name: 'EP'
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
    return (
      <div className="page-history">
        <Tree
          onFilterChange={this.changeTreeItem}
          loadData={loadTreeData}
          style={{ marginRight: 8 }}
          enableMulti={false}
        />
        <div className="right-container">
          <Spin spinning={loading}>
            <SwitchContext
              query={query}
              onFilterChange={onFilterChange}
              chartData={data.chartData}
              tableData={data.tableData}
              cardData={data.cardData || {}}
            />
          </Spin>
        </div>
      </div>
    );
  }
}
const History = HistoryFactory({
  query: {
    tsStart: moment()
      .startOf('day')
      .valueOf(),
    tsEnd: moment()
      .endOf('day')
      .valueOf(),
    aggrby: 'H',
    aggrLevel: null,
    aggrLevelKey: null,
    pointCategory: 'u',
    name: 'EP'
  },
  tabs: tabs
})(HistoryCom);

export default withRouter(History);
