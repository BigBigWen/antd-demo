import React from 'react';
import moment from 'moment';
import {
  getOption,
  Chart,
  getLegend,
  getBar,
  palette,
  getTooltip,
  dayXAxis,
  singleYAxis
} from 'Chart';

const mappers = [
  i => [moment(i[0]).format('D'), i[1]],
  i => [
    moment(i[0])
      .add(1, 'months')
      .format('D'),
    i[1]
  ],
  i => [
    moment(i[0])
      .add(1, 'years')
      .format('D'),
    i[1]
  ]
];

const EPChart = ({ data }) => {
  return (
    <Chart
      option={getOption({
        xAxis: dayXAxis({ date: new Date(), name: '(日)' }),
        yAxis: singleYAxis({ name: '(kWh)' }),
        legend: getLegend(data),
        tooltip: getTooltip({
          unit: 'kWh',
          date: new Date(),
          mode: 'D',
          type: 'category'
        }),
        series: data.map((i, index) =>
          getBar({
            name: i.name,
            data: i.data.map(mappers[index]),
            color: palette.EP[index]
          })
        ),
        color: palette.EP
      })}
    />
  );
};

export default EPChart;
