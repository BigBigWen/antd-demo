import React from 'react';
import moment from 'moment';
import {
  getOption,
  Chart,
  getPie,
  palette,
  getTooltip,
  titleForPie
} from 'Chart';

const CircuitChart = ({ data }) => {
  return (
    <Chart
      option={getOption({
        tooltip: getTooltip({
          trigger: 'item',
          formatter: () => '{b}: {d}%'
        }),
        title: titleForPie({ name: '总电量', unit: 'kWh', data, top: '43%' }),
        series: [
          getPie({
            name: '各回路用电占比',
            data: data,
            center: ['50%', '50%'],
            radius: ['63%', '80%'],
            itemStyle: {
              borderWidth: 3,
              borderColor: '#fff'
            }
          })
        ],
        color: palette.OverviewPie
      })}
    />
  );
};

export default CircuitChart;
