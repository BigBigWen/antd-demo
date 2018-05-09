const base = {
  type: 'boxplot',
  boxWidth: [6, 36]
};

const getBoxPlot = ({ name, data, color, ...rest }) => ({
  ...base,
  name,
  data,
  itemStyle: {
    color
  },
  emphasis: {
    itemStyle: {
      opacity: 1,
      shadowBlur: 0,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      color: color,
      borderColor: color,
      shadowColor: color
    }
  },
  ...rest
});

export default getBoxPlot;
