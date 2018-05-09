import moment from 'moment';
import {
  getOption,
  getLegend,
  getTooltip,
  getBar,
  getLine,
  singleYAxis,
  getBoxPlot
} from 'Chart';
import {
  numLabel,
  getDateFormat,
  tooltipWrapper,
  tooltipItem
} from 'lib/helper';
import prepareBoxplotData from 'echarts/extension/dataTool/prepareBoxplotData';
import EN_CN from 'constants/en-cn';
import { getNormalAxis, getSocketAxis } from 'lib/helper';

const processBoxPlotData = data => {
  return data.map(item => {
    const rawData = item[1];
    if (rawData.length === 1) {
      return {
        data: Array.from({ length: 5 }, () => rawData[0]),
        tooltip: [{ label: '数值', value: rawData[0] }]
      };
    } else if (rawData.length === 2) {
      return {
        data: Array.from(
          { length: 5 },
          (_, ind) => (ind === 4 ? rawData[1] : rawData[0])
        ),
        tooltip: [
          { label: '最大值', value: rawData[1] },
          { label: '最小值', value: rawData[0] }
        ]
      };
    } else if (rawData.length === 3) {
      return {
        data: [rawData[0], rawData[1], rawData[1], rawData[1], rawData[2]],
        tooltip: [
          { label: '最大值', value: rawData[2] },
          { label: '中位值', value: rawData[1] },
          { label: '最小值', value: rawData[0] }
        ]
      };
    } else if (rawData.length >= 4) {
      const data = prepareBoxplotData([rawData]).boxData[0].map(i =>
        numLabel(i)
      );
      return {
        data,
        tooltip: [
          { label: '最大值', value: data[4] },
          { label: '上四分位值', value: data[3] },
          { label: '中位值', value: data[2] },
          { label: '下四分位值', value: data[1] },
          { label: '最小值', value: data[0] }
        ]
      };
    } else {
      return {
        data: [],
        tooltip: [{ label: '数值', value: '--' }]
      };
    }
  });
};
const getYMax = chartData => {
  let arr = chartData
    .reduce(
      (prev, curr) =>
        prev.concat(...processBoxPlotData(curr.data).map(j => [...j.data])),
      []
    )
    .map(a => parseFloat(a) || 0);
  return Math.max(...arr);
};
const getYMin = chartData => {
  let arr = chartData
    .reduce(
      (prev, curr) =>
        prev.concat(...processBoxPlotData(curr.data).map(j => [...j.data])),
      []
    )
    .map(a => parseFloat(a) || 0)
    .filter(a => a);
  return Math.min(...arr);
};

const getSingleBarOrLineFunc = ({
  chartData = [],
  timeData = {},
  color = [],
  unit,
  legendName,
  type,
  ...rest
}) => {
  return getOption({
    xAxis: getNormalAxis(timeData.aggrby || '', timeData.tsStart),
    yAxis: singleYAxis({ name: `(${unit})` }),
    grid: {
      left: 70,
      right: 30,
      top: 50,
      bottom: 40
    },
    tooltip: getTooltip({
      unit: [unit],
      type: 'category',
      confine: true,
      date: timeData.tsStart,
      mode: timeData.aggrby
    }),
    legend: getLegend([{ name: legendName }], i => i, { right: 0 }),
    series: [
      ...chartData.map(
        (i, index) =>
          type === 'bar'
            ? getBar({
                name: EN_CN[legendName],
                data: i.data.map((a, ind) => [ind, a[1]]),
                color: color[index]
              })
            : getLine({
                name: EN_CN[legendName],
                data: i.data,
                color: color[index],
                areaStyle: chartData.length > 1 ? { color: '#fff' } : {}
              })
      )
    ],
    color
  });
};
// 功率因数
export const getCOSQChart = (chartData, timeData) => {
  return getSingleBarOrLineFunc({
    chartData,
    timeData,
    color: ['#6666ff'],
    unit: '',
    legendName: 'Pdmd',
    type: 'line'
  });
};

// 电量
export const getEPChart = (chartData, timeData) =>
  getSingleBarOrLineFunc({
    chartData,
    timeData,
    color: ['#1890ff'],
    unit: 'kWh',
    legendName: 'EP',
    type: 'bar'
  });
// 需量
export const getPdmdChart = (chartData, timeData) =>
  getSingleBarOrLineFunc({
    chartData,
    timeData,
    color: ['#2fc25b'],
    unit: 'kWh',
    legendName: 'Pdmd',
    type: 'bar'
  });
// 按小时折线图、有socket.io, 按日月箱型图 todo 暂时只支持一个单位
export const getLineBoxplotChart = ({
  chartData = [],
  timeData = [],
  name = '',
  unit = '',
  color = []
}) => {
  const YMax = getYMax(chartData)
    ? Math.floor(getYMax(chartData) + getYMax(chartData) * 0.05)
    : null;
  const YMin = getYMin(chartData)
    ? Math.floor(getYMin(chartData) - getYMax(chartData) * 0.05)
    : null;
  return getOption({
    xAxis: getSocketAxis(timeData.aggrby || '', timeData.tsStart),
    yAxis: singleYAxis({ name: `(${unit})`, max: YMax, min: YMin }),
    grid: {
      left: 70,
      right: 30,
      top: 50,
      bottom: 40
    },
    tooltip:
      timeData.aggrby === 'H'
        ? getTooltip({
            unit: unit,
            type: 'time',
            confine: true,
            date: timeData.tsStart,
            mode: timeData.aggrby
          })
        : {
            formatter: params => {
              const seriesIndex = params.seriesIndex;
              const dataIndex = params.dataIndex;
              const rawData = chartData[seriesIndex].data;
              const tooltipData = processBoxPlotData(rawData).map(
                i => i.tooltip
              );
              return tooltipWrapper([
                getDateFormat(dataIndex + 1, timeData.tsStart, timeData.aggrby),
                `<div>${
                  Array.isArray(name) ? EN_CN[name[seriesIndex]] : EN_CN[name]
                }</div>`,
                ...tooltipData[dataIndex].map(i =>
                  tooltipItem(i.label, i.value, unit)
                )
              ]);
            }
          },
    legend: getLegend(
      Array.isArray(name)
        ? name.map(i => ({ name: EN_CN[i] }))
        : [{ name: EN_CN[name] }],
      i => i,
      {
        right: 0
      }
    ),
    series: [
      ...chartData.map((i, index) => {
        return timeData.aggrby === 'H'
          ? getLine({
              name: EN_CN[i.name],
              data: i.data,
              color: color[index],
              areaStyle: { opacity: chartData.length > 1 ? 0 : 0.5 }
            })
          : getBoxPlot({
              name: EN_CN[i.name],
              data: processBoxPlotData(i.data).map(j => j.data),
              color: color[index]
            });
      })
    ],
    color
  });
};
