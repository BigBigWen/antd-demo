import moment from 'moment';

const ListItem = ({ color, seriesName, value, date, unit }) => `
  <div style="display: flex; flex-direction: row; align-items: center; height: 25px; justify-content: space-between;">
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
       ${seriesName} ${moment(date).format('HH:mm')}:
     </span>
     <span style="display: flex; justify-content: flex-end; height: 25px; align-items: center; margin-left: 25px;">
       ${value || value === 0 ? value : '--'}${unit}
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
        date: cur.axisValue
      }),
    ''
  );

export const PTooltipFormatter = ({ unit }) => params => {
  const list = params.reverse().map(i => ({ ...i, value: i.value[1] }));
  const contentList = list.map(i => ({ ...i, unit }));
  const content = getContent([...contentList]);
  return `
    <div style="display: flex; flex-direction: column;">
      ${content}
    </div>
  `;
};
