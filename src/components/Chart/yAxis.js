import { largeNum } from 'lib/helper';
export const singleYAxis = ({ name = '', show = true, ...rest }) => ({
  name,
  show,
  ...rest,
  axisLine: {
    show: false
  },
  axisTick: {
    show: false
  },
  splitLine: {
    lineStyle: {
      opacity: 0.72,
      type: 'dashed'
    }
  },
  axisLabel: {
    formatter: val => {
      return val < 1000000 ? val : largeNum(val);
    }
  }
});

export const doubleYAxis = ({ name = '' }) => [
  singleYAxis({ name }),
  {
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    splitLine: {
      show: false
    },
    axisLabel: {
      formatter: '{value}%',
      margin: 28
    }
  }
];
