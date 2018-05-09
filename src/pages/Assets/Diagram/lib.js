const isValue = val => typeof val === 'number' && (val || val === 0);
const changeValDisplay = (val, fix) => {
  if (val >= 100000000) {
    return (val / 100000000).toFixed(2) + '亿';
  } else if (val >= 10000 && val < 100000000) {
    return (val / 10000).toFixed(2) + '万';
  } else {
    return val.toFixed(fix || 0);
  }
};
export const getValueLabel = (val, fix) =>
  isValue(val) ? changeValDisplay(val, fix) : '--';

export const timeFormat = (row, cell) =>
  row ? (
    <div>
      <div>{row.split(' ')[0]}</div>
      <div>{row.split(' ')[1]}</div>
    </div>
  ) : null;

const isRequired = type => type === 1;
const hasValue = value => value || value === 0;
export const sortPoints = points => {
  return [
    ...[...points]
      .filter(i => isRequired(i.type))
      .filter(i => hasValue(i.value)),
    ...[...points]
      .filter(i => isRequired(i.type))
      .filter(i => !hasValue(i.value)),
    ...[...points]
      .filter(i => !isRequired(i.type))
      .filter(i => hasValue(i.value)),
    ...[...points]
      .filter(i => !isRequired(i.type))
      .filter(i => !hasValue(i.value))
  ];
};
