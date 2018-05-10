import moment from 'moment';
import {
  getOption,
  getLegend,
  getTooltip,
  getLine,
  singleYAxis,
  monthTimeXAxis
} from 'Chart';
import { numLabel } from 'lib/helper';

export const getLineChart = () => {
  let getrandom = a => Math.floor(Math.random() * a + 1);
  const data = Array.from({ length: 4320 }, (_, index) => [
    1522512000000 + 60 * index * 10000,
    numLabel(Math.random() > 0.05 ? Math.random() * 10000000 : null)
  ]);
  return getOption({
    xAxis: monthTimeXAxis({ date: moment() }),
    yAxis: singleYAxis({ name: '一个月按分钟的图' }),
    grid: {
      left: 70,
      right: 30,
      top: 50,
      bottom: 40
    },
    tooltip: getTooltip({
      unit: 'as',
      type: 'time',
      confine: true
    }),
    series: [
      getLine({
        name: '测试',
        data: data,
        color: '#fcc'
      })
    ]
  });
};
