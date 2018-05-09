import React from 'react';
import DateSwitch from 'components/DateSwitch/ControlDateSwitch';
import Button, { Row, Col, Tooltip, Icon } from 'antd';
import { getTableData, changeTime } from 'lib/helper';
import moment from 'moment';
import { Chart } from 'Chart';
import NotFound from 'components/UI/NotFound';
import './MeasurementData.less';

export default class MeasurementData extends React.Component {
  getDate = date => {
    changeTime(date, this.props.onFilterChange);
  };

  render() {
    const {
      query,
      onFilterChange,
      data,
      tabs,
      activeKey,
      onTabChange
    } = this.props;
    const activeTab = tabs.find(a => a.key === activeKey);
    const Component = activeTab.component;
    return (
      <div className="measurementData-container">
        <div className="tabContainer">
          {tabs.map(tab => (
            <div
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`item ${tab.key === activeKey ? 'active' : ''}`}
            >
              {tab.key}
            </div>
          ))}
        </div>
        <DateSwitch
          btnGroup={activeTab.dateBtn}
          selectBtn={query.aggrby}
          value={moment(query.tsStart, 'x')}
          disabledDate={() => {}}
          disabledDateYear={() => {}}
          getDate={this.getDate}
        />
        {!!Object.keys(data).length && (
          <Component {...data} query={query} activeTab={activeTab} />
        )}
        {!Object.keys(data).length && <NotFound />}
      </div>
    );
  }
}
