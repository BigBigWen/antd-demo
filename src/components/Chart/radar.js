const baseRadar = {
  shape: 'circle',
  splitNumber: 4,
  radius: '55%',
  name: {
    formatter: '{value}',
    textStyle: {
      color: '#333',
      fontSize: 16
    }
  },
  splitArea: {
    areaStyle: {
      color: ['#fff']
    }
  },
  axisLine: {
    show: false
  },
  splitLine: {
    lineStyle: {
      color: '#e8eaf0'
    }
  }
};

const baseSeries = {
  type: 'radar',
  itemStyle: {
    color: '#8543e0',
    borderWidth: 3.5
  },
  lineStyle: {
    color: '#8543e0',
    width: 2
  },
  areaStyle: {
    color: '#8543e0',
    opacity: '0.67'
  }
};

const getRadar = ({ indicator, data }) => ({
  radar: [
    {
      ...baseRadar,
      indicator: indicator.map(i => ({ name: i, max: 100, min: 0 }))
    }
  ],
  series: [
    {
      ...baseSeries,
      data
    }
  ]
});
export default getRadar;
