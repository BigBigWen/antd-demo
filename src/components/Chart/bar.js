const base = {
  type: 'bar',
  barMaxWidth: 44
  // barGap,
  // barCategoryGap
};

const getBar = ({ name, data, color, ...rest }) => ({
  ...base,
  name,
  data,
  itemStyle: {
    color
  },
  ...rest
});

export default getBar;
