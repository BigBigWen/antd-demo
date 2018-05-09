const legend = {
  top: 16,
  right: 40
};
const getLegend = (data, mapper = i => i, position) => ({
  ...legend,
  data: [...data].map(mapper).map(({ name, icon = 'rect', ...rest }) => ({
    name,
    icon,
    ...rest
  })),
  ...position
});

export default getLegend;
