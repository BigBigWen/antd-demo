import React from 'react';
import moment from 'moment';
import { PTooltipFormatter } from '../helper';
import {
  getOption,
  Chart,
  doubleYAxis,
  palette,
  getTooltip,
  hourTimeXAxis,
  getLegend,
  getLine
} from 'Chart';

const lines = [
  {
    areaStyle: {
      color: palette.P[0],
      opacity: 0.45
    },
    mapper: i => i
  },
  {
    areaStyle: { opacity: 0 },
    mapper: i => [
      moment(i[0])
        .add(1, 'days')
        .valueOf(),
      i[1]
    ]
  }
];

const PChart = ({ data }) => {
  return (
    <Chart
      option={getOption({
        xAxis: hourTimeXAxis({
          date: moment('2018-03-09'),
          name: '(时)'
        }),
        yAxis: doubleYAxis({ name: '(kW)' }),
        legend: getLegend(data),
        tooltip: getTooltip({
          unit: 'kW',
          formatter: PTooltipFormatter
        }),
        series: data.map((i, index) =>
          getLine({
            name: i.name,
            data: i.data.map(lines[index].mapper),
            color: palette.P[index],
            areaStyle: lines[index].areaStyle
          })
        ),
        color: palette.P
      })}
    />
  );
};

export default PChart;
