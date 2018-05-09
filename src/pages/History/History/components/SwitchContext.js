import React from 'react';
import DateSwitch from 'components/DateSwitch/ControlDateSwitch';
import io from 'socket.io-client';
import Button, { Row, Col, Tooltip, Icon, Select } from 'antd';
import { getTableData, changeTime, getTime } from 'lib/helper';
import { tabs } from '../config';
import moment from 'moment';
import { Chart } from 'Chart';
import NotFound from 'components/UI/NotFound';
import Card from 'components/CardForData/CardForData';
import TableForChart from 'components/TableForChart/TableForChart';
import './SwitchContext.less';
const Option = Select.Option;
import { notEmptyForChart } from 'lib/helper';

const notEmptyArray = arr => arr && arr.length;

export default class SwitchContext extends React.Component {
  componentDidMount() {
    this.onChangeTab(tabs.measurementBtns[0]);
  }
  renderMeasurement = () =>
    tabs.measurementBtns.map(btn => (
      <div
        key={btn.name}
        onClick={() => this.onChangeTab(btn)}
        className={`item ${btn.name === this.props.query.name ? 'active' : ''}`}
      >
        {btn.btnName}
      </div>
    ));
  renderCircuit = () => {
    const { circuitBtns } = tabs;
    let circuits = [...circuitBtns];
    const tabData = circuits.slice(0, 6);
    const selectData = circuits.slice(6, -1).concat(circuits.pop());
    const selectDateValue = selectData.find(
      data => data.name === this.props.query.name
    )
      ? this.props.query.name
      : '';
    return (
      <div className="circuit-tab-container">
        <div className="tabData-container">
          {tabData.map(btn => (
            <div
              key={btn.name}
              onClick={() => this.onChangeTab(btn)}
              className={`item ${
                btn.name === this.props.query.name ? 'active' : ''
              }`}
            >
              {btn.btnName}
            </div>
          ))}
        </div>
        <Select
          value={selectDateValue}
          style={{
            width: '25%',
            backgroundColor: selectDateValue ? '#ffd100' : '#fff'
          }}
          onChange={e =>
            this.onChangeTab(selectData.find(btn => btn.name === e))
          }
          placeholder="请选择更多类型数据"
        >
          {selectData.map(data => (
            <Option key={data.name} value={data.name}>
              {data.btnName}
            </Option>
          ))}
        </Select>
      </div>
    );
  };
  getDate = date => {
    changeTime(date, this.props.onFilterChange);
  };
  onChangeTab = btnDetail => {
    const time = getTime(btnDetail.defaultDate, moment());
    this.props.onFilterChange({
      name: btnDetail.name,
      aggrLevel: btnDetail.aggrLevel,
      pointCategory: btnDetail.pointCategory,
      aggrby: btnDetail.defaultDate,
      ...time
    });
  };

  render() {
    const {
      query,
      onFilterChange,
      tableData,
      chartData,
      cardData
    } = this.props;
    let currentItem =
      tabs.measurementBtns.find(a => a.name === query.name) ||
      tabs.circuitBtns.find(a => a.name === query.name);
    return (
      <div className="SwitchContext-container">
        <div className="tabContainer">
          {query.aggrLevel === 'measurement' && this.renderMeasurement()}
          {query.aggrLevel === 'circuit' && this.renderCircuit()}
        </div>
        <DateSwitch
          btnGroup={currentItem.dateBtn}
          selectBtn={query.aggrby}
          value={moment(query.tsStart, 'x')}
          getDate={this.getDate}
        />
        <div className="card-container">
          {currentItem.cardData.map(card => (
            <div className="card-item" key={card.cardName}>
              <Card
                name={card.cardName}
                value={cardData[card.key]}
                unit={card.unit}
                tooltip={card.cardName}
              />
            </div>
          ))}
        </div>
        {notEmptyForChart(chartData || []) ? (
          <Row className="chart">
            <Chart
              option={currentItem.getChartOption(chartData, query) || {}}
            />
            <TableForChart
              tableData={tableData}
              tabConfig={currentItem.tableData}
            />
          </Row>
        ) : (
          <NotFound />
        )}
      </div>
    );
  }
}
