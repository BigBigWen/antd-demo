import React from 'react';
import {
  getOption,
  Chart,
  getLegend,
  getBar,
  palette,
  dayXAxis,
  monthXAxis,
  hourCatXAxis,
  singleYAxis
} from 'Chart';
import moment from 'moment';
import {
  numLabel,
  tooltipItem,
  tooltipWrapper,
  notEmptyForChart
} from 'lib/helper';
import TableForChart from 'components/TableForChart/TableForChart';
import NotFound from 'components/UI/NotFound';

const Fragment = React.Fragment;
const chartDict = {
  H: {
    xAxis: hourCatXAxis,
    current: date => moment(date).format('MM-DD HH:mm'),
    last: date =>
      moment(date)
        .subtract(1, 'days')
        .format('MM-DD HH:mm'),
    tableData: {
      configData: [
        { key: 'time', title: '时间', col: 4 },
        { key: 'current', title: '本日电量(kWh)', col: 5 },
        { key: 'last', title: '上日电量(kWh)', col: 5 },
        { key: 'mom', title: '环比', col: 5 },
        { key: 'yoy', title: '同比', col: 5 }
      ],
      columnsNum: 1
    }
  },
  D: {
    xAxis: dayXAxis,
    current: date => moment(date).format('MM-DD'),
    last: date =>
      moment(date)
        .subtract(1, 'months')
        .format('MM-DD'),
    tableData: {
      configData: [
        { key: 'time', title: '时间', col: 4 },
        { key: 'current', title: '本月电量(kWh)', col: 5 },
        { key: 'last', title: '上月电量(kWh)', col: 5 },
        { key: 'mom', title: '环比', col: 5 },
        { key: 'yoy', title: '同比', col: 5 }
      ],
      columnsNum: 1
    }
  },
  M: {
    xAxis: monthXAxis,
    current: date => moment(date).format('YYYY-MM'),
    last: date =>
      moment(date)
        .subtract(1, 'years')
        .format('YYYY-MM'),
    tableData: {
      configData: [
        { key: 'time', title: '时间', col: 4 },
        { key: 'current', title: '本年电量(kWh)', col: 5 },
        { key: 'last', title: '上年电量(kWh)', col: 5 },
        { key: 'mom', title: '环比', col: 5 },
        { key: 'yoy', title: '同比', col: 5 }
      ],
      columnsNum: 1
    }
  }
};
const legendDict = {
  H: {
    current: '本日',
    last: '上日'
  },
  D: {
    current: '本月',
    last: '上月'
  },
  M: {
    current: '本年',
    last: '上年'
  }
};
const isNil = a => isNaN(parseFloat(a));
const base = (last, current) => {
  if (isNil(last) && isNil(current)) {
    return '--';
  } else if (isNil(last)) {
    return current;
  } else if (isNil(current)) {
    return last;
  } else {
    return parseFloat(last) <= parseFloat(current) ? last : current;
  }
};
const improve = (last, current) => {
  if (isNil(last) || isNil(current)) {
    return 0;
  } else {
    return numLabel(current - last >= 0 ? current - last : 0, 0);
  }
};
const decrease = (last, current) => {
  if (isNil(last) || isNil(current)) {
    return 0;
  } else {
    return numLabel(current - last < 0 ? last - current : 0, 0);
  }
};

const EPAnalysis = ({ query, last, current, tableData, activeTab }) => {
  const curentData = (current[0].data || []).map(i => i[1]);
  const currentTs = (current[0].data || []).map(i => i[0]);
  const lastData = (last[0].data || []).map(i => i[1]);
  const chartData = [
    {
      name: legendDict[query.aggrby].current,
      data: curentData,
      stack: 'EP',
      barGap: 0,
      label: {
        show: true,
        position: 'top',
        fontSize: 8,
        formatter: function(p) {
          const currentValue = curentData[p.dataIndex];
          const lastValue = lastData[p.dataIndex];
          return [
            `{up|${
              currentValue > lastValue
                ? '▲' + improve(lastValue, currentValue) + '%'
                : ''
            }}`,
            `{down|${
              currentValue < lastValue
                ? '▼' + decrease(lastValue, currentValue) + '%'
                : ''
            }}`
          ];
        },
        rich: {
          up: { color: '#f65655' },
          down: { color: '#2fc25b' }
        }
      }
    },
    {
      name: legendDict[query.aggrby].last,
      data: lastData,
      stack: 'lastEP'
    }
  ];
  return notEmptyForChart(current) || notEmptyForChart(last) ? (
    <Fragment>
      <div className="main-chart">
        <Chart
          option={getOption({
            xAxis: chartDict[query.aggrby].xAxis({ date: query.tsStart }),
            yAxis: singleYAxis({ name: '(kWh)' }),
            legend: getLegend([
              { name: legendDict[query.aggrby].current },
              { name: legendDict[query.aggrby].last }
            ]),
            series: chartData.map(i => getBar(i)),
            color: palette.EPAnalysis,
            tooltip: {
              trigger: 'axis',
              formatter: params => {
                const index = params[0].dataIndex;
                const value = numLabel(curentData[index] - lastData[index], 2);
                return tooltipWrapper([
                  tooltipItem(
                    legendDict[query.aggrby].current,
                    curentData[index] + 'kWh'
                  ),
                  tooltipItem(
                    legendDict[query.aggrby].last,
                    lastData[index] + 'kWh'
                  ),
                  value > 0 ? tooltipItem('增长', value, 'kWh') : '',
                  value < 0 ? tooltipItem('减少', -value, 'kWh') : ''
                ]);
              }
            }
          })}
        />
      </div>
      <TableForChart
        tableData={tableData}
        tabConfig={chartDict[query.aggrby].tableData}
      />
    </Fragment>
  ) : (
    <NotFound />
  );
};

export default EPAnalysis;
