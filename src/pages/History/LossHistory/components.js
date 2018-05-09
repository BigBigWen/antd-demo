import React from 'react';
import { Row, Col, Icon, Tooltip } from 'antd';
import DateSwitch from 'components/DateSwitch/DateSwitch';
import moment from 'moment';
import { Chart } from 'Chart';
import NotFound from 'components/UI/NotFound';
import Card from 'components/CardForData/CardForData';
import { lossDataTitle } from './mock';
import { getTableData } from 'lib/helper';
import { getDoubleChart, getSingleChart } from './lib';
import { numLabel, percentLabel } from 'lib/helper';

const getChartOption = key =>
  key === 'single' ? getSingleChart : getDoubleChart;
const notEmptyArray = arr => arr && arr.length;

export class RadioCom extends React.Component {
  render() {
    const {
      chartData,
      onFilterChange,
      tableData,
      tabKey,
      query,
      blockData
    } = this.props;
    const { totalAmount, totalRate, monthOverMonth, economicLoss } = blockData;
    return (
      <div className="chart-container">
        <Row gutter={24}>
          <Col span={6}>
            <Card
              name={'总损耗量'}
              value={totalAmount}
              unit={'kWh'}
              tooltip={'统计时间内的损耗量汇总'}
            />
          </Col>
          <Col span={6}>
            <Card
              name={'总损耗率'}
              value={totalRate}
              unit={'%'}
              tooltip={'统计时间内的总损耗率'}
            />
          </Col>
          <Col span={6}>
            <Card
              name={'损耗率环比'}
              value={monthOverMonth}
              unit={'%'}
              tooltip={'当前统计时间与前一统计时间环比'}
            />
          </Col>
          <Col span={6}>
            <Card
              name={'预计经济损失'}
              value={economicLoss}
              unit={'元'}
              tooltip={'由当地电价和总损耗量计算得出'}
            />
          </Col>
        </Row>
        {!(notEmptyArray(tableData) || notEmptyArray(chartData)) ? (
          <Row>
            <NotFound />
          </Row>
        ) : null}
        {notEmptyArray(chartData) ? (
          <Row className="single-chart">
            <Chart
              option={getChartOption(tabKey)(chartData, query)}
              style={{ width: 'calc(100% - 24px)' }}
            />
          </Row>
        ) : null}
        {notEmptyArray(tableData) ? (
          <Row className="lossData-wrapper">
            {getTableData(tableData || [], 3).map((item, ind) => (
              <Col span={8} key={ind}>
                <Row className="lossData-title">
                  {lossDataTitle.map((a, ind) => (
                    <Col key={ind} span={8}>
                      {a}
                    </Col>
                  ))}
                </Row>
                {item.map((data, ind) => (
                  <Row key={ind} className="lossData-row ">
                    <Col className="lossData-col" span={8}>
                      {data.time}
                    </Col>
                    <Col className="lossData-col" span={8}>
                      {data.amount}
                    </Col>
                    <Col className="lossData-col" span={8}>
                      {data.rate}
                    </Col>
                  </Row>
                ))}
              </Col>
            ))}
          </Row>
        ) : null}
      </div>
    );
  }
}

export class CheckCom extends React.Component {
  getDate = date => {
    changeTime(date, this.props.onFilterChange);
  };
  render() {
    const { chartData, onFilterChange, tabKey, query } = this.props;
    return (
      <div className="chart-container">
        <Row className="double-chart">
          {notEmptyArray(chartData) ? (
            <Chart
              option={getChartOption(tabKey)(chartData, query)}
              style={{ width: 'calc(100% - 24px)' }}
            />
          ) : (
            <NotFound />
          )}
        </Row>
      </div>
    );
  }
}
