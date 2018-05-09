import moment from 'moment';

const xAxis = {
  axisTick: {
    show: false
  },
  splitLine: {
    show: false
  },
  nameGap: 2
};

export const hourTimeXAxis = ({ date, ...rest }) => {
  const start = moment(date).startOf('day');
  const end = moment(date).endOf('day');
  return {
    ...xAxis,
    type: 'time',
    min: moment(start)
      .subtract(60, 'minutes')
      .valueOf(),
    max: moment(end)
      .add(15, 'minutes')
      .valueOf(),
    interval: 60 * 60 * 1000,
    axisLabel: {
      showMinLabel: false,
      showMaxLabel: false,
      formatter: val =>
        moment(val).isBefore(moment(start)) || moment(val).isAfter(moment(end))
          ? ''
          : moment(val).format('H')
    },
    ...rest
  };
};

export const hourCatXAxis = ({ ...rest }) => {
  return {
    ...xAxis,
    type: 'category',
    data: Array.from({ length: 24 }, (_, i) => i),
    ...rest
  };
};

export const dayXAxis = ({ date, ...rest }) => ({
  ...xAxis,
  type: 'category',
  data: Array.from(
    { length: date ? moment(date).daysInMonth() : 31 },
    (_, i) => i + 1
  ),
  ...rest
});

export const monthXAxis = ({ ...rest }) => ({
  ...xAxis,
  type: 'category',
  data: Array.from({ length: 12 }, (_, i) => i + 1),
  ...rest
});
export const yearXAxis = ({ ...rest }) => ({
  ...xAxis,
  type: 'category',
  data: Array.from({ length: moment().year() - 2016 }, (_, i) => i + 2016),
  ...rest
});
