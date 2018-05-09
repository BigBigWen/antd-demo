const base = {
  type: 'line',
  showSymbol: false,
  smooth: true,
  smoothMonotone: 'x'
};

const getLine = ({
  name,
  data,
  color,
  areaStyle = {
    opacity: 0
  },
  ...rest
}) => ({
  ...base,
  name,
  data,
  lineStyle: {
    color
  },
  areaStyle,
  ...rest
});

export default getLine;
