import React from 'react';
import {
  getOption,
  Chart,
  getLegend,
  getBar,
  palette,
  getTooltip,
  dayXAxis,
  monthXAxis,
  hourCatXAxis,
  singleYAxis,
  getPie,
  titleForPie
} from 'Chart';
import moment from 'moment';
import { numLabel, sum, largeNum, notEmptyForChart } from 'lib/helper';
import TableForChart from 'components/TableForChart/TableForChart';
import { tabs } from '../const';
import NotFound from 'components/UI/NotFound';

const Fragment = React.Fragment;
const chartDict = {
  D: {
    xAxis: dayXAxis
  },
  M: {
    xAxis: monthXAxis
  }
};

class EPByCircuit extends React.Component {
  // currentIndex = null;
  state = {
    currentPieData: this.props.initial
  };
  componentWillReceiveProps(nextProps) {
    this.setState({
      currentPieData: nextProps.initial
    });
  }
  onMouseOver = e => {
    if (e.dataIndex !== this.currentIndex) {
      this.currentIndex = e.dataIndex;
      const currentPieData = this.props.barData.reduce((prev, cur) => {
        return [
          ...prev,
          {
            name: cur.name,
            value: cur.data[this.currentIndex][1]
          }
        ];
      }, []);
      this.setState({ currentPieData });
    }
  };

  onMouseOut = e => {
    this.currentIndex = null;
    this.setState({
      currentPieData: this.props.initial
    });
  };

  render() {
    let { query, barData, pieData, tableData, initial } = this.props;
    const { currentPieData } = this.state;
    const currentItem = tabs[1];
    return notEmptyForChart(barData) || notEmptyForChart(pieData) ? (
      <Fragment>
        <div className="main-chart">
          <div className="sub-chart" style={{ width: '55%' }}>
            {notEmptyForChart(barData) ? (
              <Chart
                option={getOption({
                  xAxis: chartDict[query.aggrby].xAxis({ date: query.tsStart }),
                  yAxis: singleYAxis({ name: '(kWh)' }),
                  series: barData.map(i => getBar(i)),
                  color: palette.EPByCircuits,
                  tooltip: getTooltip({
                    unit: 'kWh',
                    date: query.tsStart,
                    mode: query.aggrby,
                    type: 'category',
                    total: { name: '总电量' }
                  })
                })}
                onEvents={{
                  mouseover: this.onMouseOver,
                  mouseout: this.onMouseOut
                }}
              />
            ) : (
              <NotFound />
            )}
          </div>
          <div className="sub-chart" style={{ width: '45%' }}>
            <Chart
              option={getOption({
                tooltip: getTooltip({
                  trigger: 'item',
                  formatter: () => '{b}: {c}kWh'
                }),
                title: titleForPie({
                  name: '总电量',
                  unit: 'kWh',
                  data: currentPieData
                }),
                series: [
                  getPie({
                    name: '总电量',
                    data: currentPieData.map(i => ({
                      name: i.name,
                      value: numLabel(i.value)
                    })),
                    center: ['50%', '50%'],
                    radius: ['40%', '55%'],
                    itemStyle: {
                      borderWidth: 3,
                      borderColor: '#fff'
                    },
                    hoverAnimation: false,
                    label: {
                      show: true,
                      formatter: '{b}: {d}%',
                      color: '#333'
                    },
                    labelLine: {
                      show: true
                    }
                  })
                ],
                color: palette.EPStatistics
              })}
            />
          </div>
        </div>
        <TableForChart
          tableData={tableData}
          tabConfig={currentItem.tableData}
        />
      </Fragment>
    ) : (
      <NotFound />
    );
  }
}

export default EPByCircuit;
