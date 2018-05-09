import moment from 'moment';
import { numLabel } from 'lib/helper';
// mock 折线图和箱线图数据
export const lineBoxplot = ({ name, ts, mode }) => {
  if (mode === 'H') {
    return Array.isArray(name)
      ? name.map(i => ({
          name: i,
          data: Array.from({ length: 20 }, (_, index) => [
            moment(
              moment(ts).format('YYYY-MM-DD') +
                ' ' +
                `${index <= 9 ? '0' + index : index}`
            ).valueOf(),
            numLabel(Math.random() > 0.05 ? Math.random() * 10000000 : null)
          ])
        }))
      : [
          {
            name: name,
            data: Array.from({ length: 20 }, (_, index) => [
              moment(
                moment(ts).format('YYYY-MM-DD') +
                  ' ' +
                  `${index <= 9 ? '0' + index : index}`
              ).valueOf(),
              numLabel(Math.random() > 0.05 ? Math.random() * 10000000 : null)
            ])
          }
        ];
  } else {
    return Array.isArray(name)
      ? name.map(i => ({
          name: i,
          data: Array.from({ length: 12 }, (_, index) => [
            index,
            Array.from({ length: Math.floor(Math.random() * 10) }, () =>
              numLabel(Math.random() * 10000000)
            )
          ])
        }))
      : [
          {
            name: name,
            data: Array.from({ length: 12 }, (_, index) => [
              index,
              Array.from({ length: Math.floor(Math.random() * 10) }, () =>
                numLabel(Math.random() * 10000000)
              )
            ])
          }
        ];
  }
};

// mock 功率因数
export const COSQ = ({ name, ts, mode }) => {
  return [
    {
      name,
      data: Array.from({ length: 12 }, (_, index) => [
        index,
        numLabel(Math.random() > 0.05 ? Math.random() * 10000000 : null)
      ])
    }
  ];
};

// mock 柱状图
export const bar = ({ name, ts, mode }) => {
  return [
    {
      name,
      data: Array.from({ length: 10 }, (_, index) => [
        index,
        numLabel(Math.random() > 0.05 ? Math.random() * 10000000 : null)
      ])
    }
  ];
};
