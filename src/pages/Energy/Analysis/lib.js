import moment from 'moment';
import {
  getOption,
  getLegend,
  getTooltip,
  getBar,
  getLine,
  singleYAxis,
  palette,
  getScatter
} from 'Chart';
import { getNormalAxis, tooltipWrapper, tooltipItem } from 'lib/helper';
import EN_CN from 'constants/en-cn';

// 电费分析
export const getElectricityChartOption = (data = [], query = {}) => {
  return getOption({
    xAxis: getNormalAxis('M', query.tsStart),
    yAxis: singleYAxis({ name: '(RMB)' }),
    tooltip: getTooltip({
      type: 'category',
      confine: true,
      date: query.tsStart,
      mode: 'M'
    }),
    legend: getLegend([
      { name: '总电费' },
      { name: '基本电费' },
      { name: '力调电费' },
      { name: '电度电费' }
    ]),
    series: [
      ...data.map((i, ind) =>
        getBar({
          name: i.name,
          data: i.data,
          stack: i.stack,
          color: palette.ElectricityAnalysis[ind]
        })
      )
    ]
  });
};
// 报装方式
export const getForecastChartOption = (data = [], query = {}) => {
  return getOption({
    xAxis: getNormalAxis('M', query.tsStart),
    yAxis: singleYAxis({ name: '(RMB)' }),
    tooltip: getTooltip({
      type: 'category',
      confine: true,
      date: query.tsStart,
      mode: 'M'
    }),
    legend: getLegend([{ name: '按容计算' }, { name: '按需计算' }]),
    series: [
      ...data.map((i, ind) =>
        getBar({
          name: i.name,
          data: i.data,
          color: palette.Forecast[ind]
        })
      )
    ]
  });
};
// 负载分析
export const getLoatRatioChartOption = (data = [], query = {}) => {
  return getOption({
    xAxis: getNormalAxis(query.aggrby || '', query.tsStart),
    yAxis: singleYAxis({ name: '(%)' }),
    tooltip: getTooltip({
      type: 'category',
      confine: true,
      date: query.tsStart,
      mode: query.aggrby
    }),
    legend: getLegend({ name: '负载率' }),
    series: [
      ...data.map((i, ind) =>
        getLine({
          name: i.name,
          data: i.data,
          color: palette.loadRation[0],
          areaStyle: {
            color: palette.loadRation[1]
          }
        })
      )
    ],
    color: palette.loadRation
  });
};
export const getLoadChartOption = (data = [], query = {}) => {
  return getOption({
    xAxis: {
      type: 'category',
      data: [
        '0',
        '10',
        '20',
        '30',
        '40',
        '50',
        '60',
        '70',
        '80',
        '90',
        '100',
        '>100'
      ]
    },
    yAxis: singleYAxis({ name: '(时)' }),
    tooltip: {
      formatter: params => {
        return tooltipWrapper([
          moment(query.tsStart).format(
            query.aggrby === 'H' ? 'YYYY-MM-DD' : 'YYYY-MM'
          ),
          tooltipItem(params.seriesName, params.value)
        ]);
      }
    },
    legend: getLegend([
      { name: '轻载' },
      { name: '正常' },
      { name: '重载' },
      { name: '超载' }
    ]),
    series: [
      ...data.map((i, ind) =>
        getBar({
          name: i.name,
          data: i.data,
          stack: 'load',
          color: palette.loadData[ind]
        })
      )
    ]
  });
};
// 功率因数
export const getCOSQChartOption = (data = [], query = {}) => {
  return getOption({
    xAxis: getNormalAxis('M', query.tsStart),
    yAxis: singleYAxis({
      splitArea: {
        show: true,
        areaStyle: {
          color: '#fce3eb'
        }
      }
    }),
    tooltip: getTooltip({
      type: 'category',
      confine: true,
      date: query.tsStart,
      mode: 'M'
    }),
    legend: getLegend([{ name: '功率因数' }]),
    series: [
      ...data.map((i, ind) =>
        getScatter({
          name: i.name,
          data: i.data,
          color: palette.COSQData[ind],
          markLine: {
            silent: true,
            data: [{ yAxis: 0.9 }],
            lineStyle: { color: '#8543e0', type: 'solid' },
            label: {
              normal: {
                formatter: '奖罚分界线',
                show: true,
                position: 'start'
              }
            }
          },
          markArea: {
            silent: true,
            itemStyle: { color: '#f2e8fd' },
            data: [[{ yAxis: '0.9' }, { yAxis: '1' }]]
          }
        })
      )
    ]
  });
};
