import moment from 'moment';
import {
  getOption,
  monthXAxis,
  getLegend,
  getTooltip,
  getBar,
  dayXAxis,
  getLine,
  doubleYAxis,
  palette,
  hourCatXAxis
} from 'Chart';
// todo 此处changeTime由于历史原因与其他地方不一致，暂时保留
export const changeTime = (date, onFilterChange) => {
  switch (date.interval) {
    case '按小时':
      onFilterChange({
        from: moment(date.date, 'x')
          .startOf('day')
          .valueOf(),
        to: moment(date.date, 'x')
          .endOf('day')
          .valueOf(),
        interval: 'DAY'
      });
      break;
    case '按日':
      onFilterChange({
        from: moment(date.date, 'x')
          .startOf('month')
          .valueOf(),
        to: moment(date.date, 'x')
          .endOf('month')
          .valueOf(),
        interval: 'MONTH'
      });
      break;
    case '按月':
      onFilterChange({
        from: moment(date.date, 'x')
          .startOf('year')
          .valueOf(),
        to: moment(date.date, 'x')
          .endOf('year')
          .valueOf(),
        interval: 'YEAR'
      });
      break;
    default:
      break;
  }
};

const getIntervalFun = (type, time) => {
  switch (type) {
    case 'DAY':
      return hourCatXAxis({ name: '(时)' });
    case 'MONTH':
      return dayXAxis({ date: time, name: '(日)' });
    case 'YEAR':
      return monthXAxis({ name: '(月)' });
    default:
      return {};
  }
};

export const getSingleChart = (chartData = [], timeData = {}) => {
  return getOption({
    xAxis: getIntervalFun(timeData.interval || '', timeData.from),
    yAxis: doubleYAxis({ name: '(kWh)' }),
    tooltip: getTooltip({
      unit: ['kWh', '%'],
      fix: [0, 2],
      type: 'category',
      confine: true,
      date: timeData.from,
      mode:
        timeData.interval === 'DAY'
          ? 'H'
          : timeData.interval === 'MONTH' ? 'D' : 'M'
    }),
    legend: getLegend([{ name: '损耗量' }, { name: '损耗率', icon: 'line' }]),
    series: [
      ...chartData.map(i =>
        getBar({
          name: '损耗量',
          data: i.map((j, ind) => [ind, j.amount])
        })
      ),
      ...chartData.map(i =>
        getLine({
          name: '损耗率',
          data: i.map((j, ind) => [ind, j.rate]),
          yAxisIndex: 1
        })
      )
    ],
    color: [palette.lossAmount[0], palette.lossRate[0]]
  });
};

export const getDoubleChart = (chartData = [], timeData = {}) => {
  const color = [
    ...chartData.map((_, ind) => palette.lossAmount[ind]),
    ...chartData.map((_, ind) => palette.lossRate[ind])
  ];
  return getOption({
    xAxis: getIntervalFun(timeData.interval || '', timeData.from),
    yAxis: doubleYAxis({}),
    dataZoom: [{ type: 'inside' }, { type: 'slider' }],
    tooltip: getTooltip({
      unit: [
        ...Array.from({ length: chartData.length }, () => 'kWh'),
        ...Array.from({ length: chartData.length }, () => '%')
      ],
      fix: [
        ...Array.from({ length: chartData.length }, () => 0),
        ...Array.from({ length: chartData.length }, () => 2)
      ],
      mode:
        timeData.interval === 'DAY'
          ? 'H'
          : timeData.interval === 'MONTH' ? 'D' : 'M',
      type: 'category',
      confine: true,
      date: timeData.from,
      color
    }),
    series: [
      ...chartData.map((i, index) =>
        getBar({
          name: i[0].name + '--损耗量',
          data: i.map((j, ind) => [ind, j.amount]),
          color: palette.lossAmount[index]
        })
      ),
      ...chartData.map((i, index) =>
        getLine({
          name: i[0].name + '--损耗率',
          data: i.map((j, ind) => [ind, j.rate]),
          color: palette.lossRate[index],
          yAxisIndex: 1
        })
      )
    ],
    color
  });
};
