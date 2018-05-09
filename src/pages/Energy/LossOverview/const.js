import { getOption, singleYAxis, getTooltip, dayXAxis } from 'Chart';
import moment from 'moment';

const baseOption = {
  grid: {
    top: 10,
    bottom: 40,
    left: 125,
    right: 90
  },
  xAxis: {
    type: 'value',
    splitLine: { lineStyle: { type: 'dashed' } },
    axisLabel: {
      show: false
    },
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    }
  }
};

const getChartLabelName = (name, maxLength = 10) =>
  (name || '').split('').length > maxLength ? name.slice(0, 10) + '...' : name;

const baseCardOption = {
  xAxis: dayXAxis({
    show: false,
    date: moment().add(-1, 'month')
  }),
  yAxis: singleYAxis({ show: false }),
  grid: {
    show: false,
    left: '8%',
    right: '8%',
    top: '17%',
    bottom: '7%'
  }
};

export const rateOption = data => ({
  ...baseOption,
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      // 坐标轴指示器，坐标轴触发有效
      type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
    },
    formatter: params =>
      params[0].name
        ? `${params[0].name}<br/>损耗率: ${params[0].value}%`
        : '--'
  },
  yAxis: [
    {
      type: 'category',
      data: [...data].map(i => i.name),
      axisTick: {
        show: false
      },
      axisLine: {
        lineStyle: {
          color: '#a0a0a0'
        }
      },
      axisLabel: {
        color: '#333',
        formatter: value => getChartLabelName(value)
      }
    },
    {
      type: 'category',
      offset: 70,
      data: data.map(i => {
        return i.name !== '' ? i.lossAmount : '';
      }),
      axisTick: {
        show: false
      },
      axisLabel: {
        align: 'right',
        color: '#333'
      },
      axisLine: {
        show: false,
        lineStyle: {
          color: '#a0a0a0'
        }
      },
      nameTextStyle: {
        color: '#333'
      }
    }
  ],
  series: [
    {
      type: 'bar',
      barWidth: 18,
      barGap: 20,
      data: data.map(i => i.lossRate),
      silent: true
    }
  ],
  color: '#ff8400'
});

export const amountOption = data => ({
  ...baseOption,
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      // 坐标轴指示器，坐标轴触发有效
      type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
    },
    formatter: params => {
      return params[0].name
        ? `${params[0].name}<br/>损耗量: ${params[0].value}kWh`
        : '';
    }
  },
  yAxis: [
    {
      type: 'category',
      data: [...data].map(i => i.name),
      axisTick: {
        show: false
      },
      axisLine: {
        lineStyle: {
          color: '#a0a0a0'
        }
      },
      axisLabel: {
        color: '#333',
        formatter: value => getChartLabelName(value)
      }
    },
    {
      type: 'category',
      offset: 70,
      data: data.map(i => {
        return i.name !== '' ? i.lossRate : '';
      }),
      axisTick: {
        show: false
      },
      axisLabel: {
        align: 'right',
        color: '#333'
      },
      axisLine: {
        show: false,
        lineStyle: {
          color: '#a0a0a0'
        }
      }
    }
  ],
  series: [
    {
      type: 'bar',
      barWidth: 18,
      data: data.map(i => i.lossAmount),
      silent: true
    }
  ],
  color: '#1890ff'
});

export const getCardOption = ({ option, unit, fix = 2 }) =>
  getOption({
    ...baseCardOption,
    ...option,
    tooltip: getTooltip({
      unit: unit,
      mode: 'D',
      type: 'category',
      confine: true,
      fix,
      date: moment().add(-1, 'month')
    })
  });

export const baseCardStyle = {
  minWidth: 240,
  height: '21vw',
  minHeight: 271
};
