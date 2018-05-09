import moment from 'moment';
import { compose, sum, numLabel, getDateFormat } from 'lib/helper';

const notEmpty = arr => arr.filter(i => i !== '--');
const transFloat = arr => arr.map(i => parseFloat(i));

const ListItem = ({ color, seriesName, value, unit, top }) => `
  <div style="display: flex; flex-direction: row; align-items: center; height: 25px; justify-content: space-between; margin-top: ${top ||
    0}px">
     <span style="display: flex; flex: 0 0 auto; justify-content: flex-start;height: 25px; align-items: center">
       <span
         style="
           display: inline-block;
           border-radius: 50%;
           width: 12px;
           height: 12px;
           background-color: ${color};
           margin-right: 10px;
         "
       ></span>
       ${seriesName}:
     </span>
     <span style="display: flex; justify-content: flex-end; height: 25px; align-items: center; margin-left: 25px;">
       ${value}${unit}
     </span>
  </div>
`;

const getContent = arr =>
  arr.reduce(
    (prev, cur, curIndex) =>
      prev +
      ListItem({
        color: cur.color,
        seriesName: cur.seriesName,
        value: cur.value,
        unit: cur.unit,
        top: cur.top || 0
      }),
    ''
  );

const defaultFormatter = ({
  total,
  unit,
  date,
  mode,
  type,
  color
}) => params => {
  if (!params) return;
  const list = params.map(i => ({
    ...i,
    value: Array.isArray(i.value) ? i.value[1] : i.value,
    color: color.length ? color[i.seriesIndex] : i.color
  }));
  const valueList = list.map(i => i.value);
  const contentList = list.map((i, ind) => ({
    ...i,
    unit: Array.isArray(unit) ? unit[ind] : unit
  }));
  const content = getContent(
    total
      ? [
          ...contentList,
          {
            color: 'transparent',
            seriesName: total.name || '总计',
            unit,
            value: notEmpty(valueList).length
              ? compose(numLabel, sum, transFloat, notEmpty)(valueList)
              : '--',
            top: 10
          }
        ]
      : [...contentList]
  );
  return `
    <div style="display: flex; flex-direction: column;">
      <div>${
        params[0]
          ? type === 'category'
            ? getDateFormat(params[0].axisValueLabel, date, mode)
            : moment(params[0].axisValue).format('YYYY-MM-DD HH:mm:ss')
          : '--'
      }</div>
      ${content}
    </div>
  `;
};

const getTooltip = ({
  trigger = 'axis',
  unit = '',
  hasTotal = false,
  formatter = defaultFormatter,
  date = moment(),
  mode = 'H',
  type = 'category',
  confine = false,
  color = [],
  ...rest
}) => ({
  trigger,
  confine,
  formatter: formatter({ hasTotal, unit, mode, type, date, color, ...rest })
});

export default getTooltip;
