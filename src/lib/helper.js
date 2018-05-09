import moment from 'moment';
import {
  hourTimeXAxis,
  hourCatXAxis,
  dayXAxis,
  monthXAxis,
  yearXAxis
} from 'Chart';
import { allYear } from 'constants/const';

const numTrans = (num, level, unit, fixed = 0) =>
  `${(num / level).toFixed(fixed)}${unit}`;
// 大数字转换
export const largeNum = num =>
  num >= 100000000
    ? numTrans(num, 100000000, '亿', 1)
    : num >= 1000000 ? numTrans(num, 10000, '万') : numLabel(num, 0);
// 转两位数
export const getTwoDigits = num => `${num <= 9 ? `0${num}` : num}`;
// 函数式编程组合
export const compose = (...fns) => value =>
  [...fns].reverse().reduce((prev, fn) => fn(prev), value);
// 数组求和
export const sum = arr =>
  numLabel(arr.reduce((prev, cur) => prev + parseFloat(cur), 0));
// 数组求平均
export const average = (arr, fix) => numLabel(sum(arr) / arr.length, fix);
// 计算百分比
export const percent = (num, total) => percentLabel(num / total * 100) + '%';
// 数字显示
export const numLabel = (num, fix = 2, label = '--') =>
  !isNaN(parseFloat(num)) ? parseFloat(num).toFixed(fix) : label;
// 百分比显示
export const percentLabel = num =>
  isNaN(parseFloat(num)) ? '--' : numLabel(num * 100, 2);
// 日期显示
export const dateLabel = (date, format = 'YYYY-MM-DD HH:mm:ss') =>
  date ? moment(date).format(format) : '';
// 日期转时间戳
export const timeStamp = date => moment(date).format('x');
// 求环比和同比 month on month
export const mom = (current, last) => {
  return percentLabel((current - last) / last);
};
// 求电费系数
export const billFactor = COSQ => {
  let cosq = numLabel(COSQ);
  if (cosq === '--') {
    return '--';
  } else if (cosq >= 0.95 && cosq <= 1.0) {
    return -0.75;
  } else if (cosq >= 0.9 && cosq < 0.95) {
    return ((0.9 - cosq) * 15).toFixed(2);
  } else if (cosq >= 0.7 && cosq < 0.9) {
    return ((0.9 - cosq) * 50).toFixed(2);
  } else if (cosq < 0.7 && cosq >= 0.65) {
    return (10 + (0.7 - cosq) * 100).toFixed(2);
  } else {
    return (15 + (0.65 - cosq) * 200).toFixed(2);
  }
};
// 不同模式下数字转日期显示, label: 数值, date: 日期, mode: 日期模式
export const getDateFormat = (label, date, mode) => {
  switch (mode) {
    case 'H':
      return (
        moment(date).format('YYYY-MM-DD') + ' ' + getTwoDigits(label) + ':00'
      );
    case 'D':
      return moment(date).format('YYYY-MM') + '-' + getTwoDigits(label);
    case 'M':
      return moment(date).format('YYYY') + '-' + getTwoDigits(label);
    default:
      return '';
  }
};
// 比较常用的label + value形式的tooltipItem
export const tooltipItem = (label, value, unit = '') => `
  <div style="display: flex; flex-direction: row; align-items: center; height: 25px; justify-content: space-between;">
     <span style="display: flex; flex: 0 0 auto; justify-content: flex-start;height: 25px; align-items: center">
       ${label}:
     </span>
     <span style="display: flex; justify-content: flex-end; height: 25px; align-items: center; margin-left: 25px;">
       ${value}${unit}
     </span>
  </div>
`;
// 比较常用的tooltip的容器
export const tooltipWrapper = children => `
  <div style="display: flex; flex-direction: column;">
  ${Array.isArray(children) ? children.join('') : children}
  </div>
`;
// 生成表下方表格数据
export const getTableData = (array, colNum) => {
  const size = Math.ceil(array.length / colNum);
  return Array.from({ length: colNum }, (v, i) => i).map(a =>
    array.slice(a * size, (a + 1) * size)
  );
};
// 根据表单信息生成查询参数并调用查询函数
export const changeTime = (date, onFilterChange) => {
  switch (date.interval) {
    case '按小时':
      onFilterChange({
        tsStart: moment(date.date, 'x')
          .startOf('day')
          .valueOf(),
        tsEnd: moment(date.date, 'x')
          .endOf('day')
          .valueOf(),
        aggrby: 'H'
      });
      break;
    case '按日':
      onFilterChange({
        tsStart: moment(date.date, 'x')
          .startOf('month')
          .valueOf(),
        tsEnd: moment(date.date, 'x')
          .endOf('month')
          .valueOf(),
        aggrby: 'D'
      });
      break;
    case '按月':
      onFilterChange({
        tsStart: moment(date.date, 'x')
          .startOf('year')
          .valueOf(),
        tsEnd: moment(date.date, 'x')
          .endOf('year')
          .valueOf(),
        aggrby: 'M'
      });
      break;
    case '按年':
      onFilterChange({
        tsStart: allYear.from,
        tsEnd: allYear.to,
        aggrby: 'Y'
      });
      break;
    default:
      break;
  }
};
export const getTime = (mode, date) => {
  switch (mode) {
    case 'H':
      return {
        tsStart: moment(date, 'x')
          .startOf('day')
          .valueOf(),
        tsEnd: moment(date, 'x')
          .endOf('day')
          .valueOf()
      };
    case 'D':
      return {
        tsStart: moment(date, 'x')
          .startOf('month')
          .valueOf(),
        tsEnd: moment(date, 'x')
          .endOf('month')
          .valueOf(),
        aggrby: 'D'
      };
    case 'M':
      return {
        tsStart: moment(date, 'x')
          .startOf('year')
          .valueOf(),
        tsEnd: moment(date, 'x')
          .endOf('year')
          .valueOf(),
        aggrby: 'M'
      };
    case 'Y':
      return {
        tsStart: allYear.from,
        tsEnd: allYear.to
      };
    default:
      break;
  }
};
// 根据所选时间和时间模式返回不同的x轴，适合按小时需要有socket.io的情况
export const getSocketAxis = (type, time) => {
  switch (type) {
    case 'H':
      return hourTimeXAxis({ date: time, name: '(时)' });
    case 'D':
      return dayXAxis({ date: time, name: '(日)' });
    case 'M':
      return monthXAxis({ name: '(月)' });
    case 'Y':
      return yearXAxis({ name: '(年)' });
    default:
      return {};
  }
};
// 根据所选时间和时间模式返回不同的x轴，适合按小时不要socket.io的情况
export const getNormalAxis = (type, time) => {
  switch (type) {
    case 'H':
      return hourCatXAxis({ name: '(时)' });
    case 'D':
      return dayXAxis({ date: time, name: '(日)' });
    case 'M':
      return monthXAxis({ name: '(月)' });
    case 'Y':
      return yearXAxis({ name: '(年)' });
    default:
      return {};
  }
};
// 校验图非空
const notEmpty = arr => arr && arr.some(a => a[1] && a[1] !== '--');
export const notEmptyForChart = arr => arr.some(i => notEmpty(i.data));
// Card拿数据
export const gettotal = arr =>
  arr.map(a => a[1] || 0).reduce((prev, curr) => prev + curr);

export const getMax = arr => {
  const newArr = arr.map(a => a[1] || 0);
  return Math.max(newArr) || '--';
};
export const getMin = arr => {
  const newArr = arr.map(a => a[1] || 0);
  return Math.min(newArr) || '--';
};
