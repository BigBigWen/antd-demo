import React from 'react';
import { Tabs, Spin, Row } from 'antd';
import { withRouter } from 'react-router-dom';
import TreeTableFactory from 'components/Hoc/TreeTableFactory';
import Tree from 'components/Tree/Tree';
import API from 'rest/History/LossHistory';
import moment from 'moment';
import './LossHistory.less';
import { RadioCom, CheckCom } from './components';
import DateSwitch from 'components/DateSwitch/DateSwitch';
import { changeTime } from './lib';
import scrollToTop from 'components/Hoc/scrollTop';

const TabPane = Tabs.TabPane;
const { loadMeasurementLoss, getStatistics, getSingleStatistics } = API;

class LossHistoryCom extends React.Component {
  getDate = date => {
    changeTime(date, this.props.onFilterChange);
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
      <div className="page-loss-history">
        <Tree
          onFilterChange={onFilterChange}
          loadData={loadMeasurementLoss}
          enableMulti
          changeActiveKey={changeActiveKey}
          style={{ marginRight: 8 }}
        />
        <div className="right-container">
          <Row className="date-container">
            <DateSwitch
              btnGroup={['按小时', '按日', '按月']}
              defaultSelectBtn="按小时"
              value={moment(query.from)}
              disabledDate={() => {}}
              disabledDateYear={() => {}}
              getDate={this.getDate}
            />
          </Row>
          <Spin spinning={loading}>
            <Tabs activeKey={tabsActiveKey} onChange={changeActiveKey}>
              {tabsData.map(tab => {
                const Com = tab.Component;
                return (
                  <TabPane tab={tab.name} key={tab.key}>
                    <Com
                      onFilterChange={onFilterChange}
                      chartData={data.chartData || []}
                      tableData={data.tableData || []}
                      tabKey={tab.key}
                      blockData={
                        data.blockData || {
                          totalAmount: '--',
                          totalRate: '--',
                          monthOverMonth: '--',
                          economicLoss: '--'
                        }
                      }
                      query={query}
                    />
                  </TabPane>
                );
              })}
            </Tabs>
          </Spin>
        </div>
      </div>
    );
  }
}

const LossHistory = TreeTableFactory({
  query: {
    from: moment()
      .startOf('day')
      .valueOf(),
    to: moment()
      .endOf('day')
      .valueOf(),
    interval: 'DAY',
    lossId: []
  },
  tabs: {
    showTabPane: false,
    tabArr: [
      {
        Component: RadioCom,
        getAction: getSingleStatistics,
        name: '单选',
        key: 'single'
      },
      {
        Component: CheckCom,
        getAction: getStatistics,
        name: '多选',
        key: 'multiple'
      }
    ]
  }
})(LossHistoryCom);

export default withRouter(LossHistory);
