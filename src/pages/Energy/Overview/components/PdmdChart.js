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

const PdmdChart = ({ data }) => {
  return (
    <Chart
      option={getOption({
        xAxis: dayXAxis({ date: moment(), name: '(日)' }),
        yAxis: singleYAxis({ name: '(kW)' }),
        legend: getLegend(data),
        tooltip: getTooltip({
          unit: 'kW',
          date: moment(),
          mode: 'D',
          type: 'category'
        }),
        series: data.map((i, index) =>
          getBar({
            name: i.name,
            data: i.data.map(j => [moment(j[0]).format('D'), j[1]]),
            color: palette.Pdmd[index]
          })
        ),
        color: palette.Pdmd
      })}
    />
  );
};

export default PdmdChart;
