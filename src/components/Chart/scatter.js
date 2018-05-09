const base = {
  type: 'scatter',
  symbolSize: 15
};

const getScatter = ({ name, data, color, ...rest }) => ({
  ...base,
  name,
  data,
  itemStyle: {
    color
  },
  ...rest
});

export default getScatter;
