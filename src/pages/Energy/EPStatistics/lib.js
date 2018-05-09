import moment from 'moment';
import {
  getOption,
  monthXAxis,
  getLegend,
  getTooltip,
  getBar,
  dayXAxis,
  singleYAxis,
  palette,
  hourCatXAxis
} from 'Chart';
import { getNormalAxis } from 'lib/helper';

export const getChartOption = (data = [], query = {}) => {
  return getOption({
    xAxis: getNormalAxis(query.aggrby || '', query.tsStart),
    yAxis: singleYAxis({ name: '(kWh)' }),
    tooltip: getTooltip({
      unit: 'kWh',
      type: 'category',
      confine: true,
      date: query.tsStart,
      mode: query.aggrby
    }),
    legend: getLegend([...data.map(a => ({ name: a.name }))]),
    series: [
      ...data.map((i, ind) =>
        getBar({
          name: i.name,
          data: i.data,
          stack: i.stack,
          color: palette.EPStatistics[ind]
        })
      )
    ]
  });
};
