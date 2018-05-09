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
import { numLabel, notEmptyForChart } from 'lib/helper';
import NotFound from 'components/UI/NotFound';

const Fragment = React.Fragment;
const chartDict = {
  H: {
    xAxis: hourCatXAxis
  },
  D: {
    xAxis: dayXAxis
  },
  M: {
    xAxis: monthXAxis
  }
};
const getPieOption = ({ name, data, unit }) =>
  getOption({
    tooltip: getTooltip({
      trigger: 'item',
      formatter: () => '{b}: {c}kWh'
    }),
    title: titleForPie({ name, unit, data }),
    legend: {
      data: data.map(i => ({ icon: 'circle', name: i.name })),
      bottom: 0,
      left: 'center',
      itemGap: 40
    },
    series: [
      getPie({
        name: name,
        data: data.map(i => ({ name: i.name, value: numLabel(i.value) })),
        center: ['50%', '50%'],
        radius: ['45%', '65%'],
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
    color: palette.EPByTime
  });

const EPByTime = ({ query, mainChartData, leftChartData, rightChartData }) => {
  return notEmptyForChart(mainChartData) ||
    notEmptyForChart(leftChartData) ||
    notEmptyForChart(rightChartData) ? (
    <Fragment>
      <div className="main-chart">
        {notEmptyForChart(mainChartData) ? (
          <Chart
            option={getOption({
              xAxis: chartDict[query.aggrby].xAxis({ date: query.tsStart }),
              yAxis: singleYAxis({ name: '(kWh)' }),
              legend: getLegend(mainChartData),
              series: mainChartData.map(i => getBar(i)),
              color: palette.EPByTime,
              tooltip: getTooltip({
                unit: 'kWh',
                date: query.tsStart,
                mode: query.aggrby,
                type: 'category',
                total: { name: '总电量' }
              })
            })}
          />
        ) : (
          <NotFound />
        )}
      </div>
      <div className="main-chart">
        <div className="sub-chart">
          <div className="title">分时电量占比</div>
          <div className="chart-wrapper">
            {notEmptyForChart(leftChartData) ? (
              <Chart
                option={getPieOption({
                  name: '总电量',
                  data: leftChartData,
                  unit: 'kWh'
                })}
              />
            ) : (
              <NotFound />
            )}
          </div>
        </div>
        <div className="sub-chart">
          <div className="title">分时电费占比</div>
          <div className="chart-wrapper">
            {notEmptyForChart(rightChartData) ? (
              <Chart
                option={getPieOption({
                  name: '总电费',
                  data: rightChartData,
                  unit: '元'
                })}
              />
            ) : (
              <NotFound />
            )}
          </div>
        </div>
      </div>
    </Fragment>
  ) : (
    <NotFound />
  );
};

export default EPByTime;
