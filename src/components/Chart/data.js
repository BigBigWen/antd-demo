// import EN_CN from 'constants/en-cn';

const defaultMapper = ([key, data]) => ({
  // name: EN_CN[key],
  data
});

const getChartData = (data, mapper = defaultMapper) => {
  return Object.keys(data).length ? Object.entries(data).map(mapper) : [];
};

export default getChartData;
