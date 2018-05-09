import { getMeasurements } from '../api/Measurement';
import { getLoss, getStatistics, getSingleStatistics } from '../api/Loss';
import { compose } from 'lib/helper';
import { maxSize } from 'constants/const';

const TYPES = [
  {
    key: 'TOTAL_LOSS',
    title: '总损耗'
  },
  {
    key: 'TRANSFORMER_LOSS',
    title: '变压器损耗'
  },
  {
    key: 'CIRCUIT_LOSS',
    title: '线路损耗'
  }
];

export const loadMeasurementLoss = async projectId => {
  if (!projectId) {
    return [
      {
        title: '损耗列表',
        key: 'lossId',
        children: []
      }
    ];
  }

  let [measurements, loss] = await Promise.all([
    getMeasurements({ projectId }),
    getLoss({
      projectId,
      size: maxSize
    })
  ]);

  const getLossByMeasurement = measurementId => loss =>
    compose(
      arr => arr.map(i => ({ key: i.id + '', title: i.name, type: i.type })),
      arr => arr.filter(i => (i.measurement || {}).id === measurementId)
    )(loss);

  const getLossByType = types => lossByMeasurement =>
    types.reduce((prev, cur) => {
      let children = lossByMeasurement.filter(i => i.type === cur.key);
      children.length && prev.push({ ...cur, children });
      return prev;
    }, []);

  const getChildrenForMeasurements = measurements =>
    measurements.reduce(
      (prev, cur) => [
        ...prev,
        {
          key: cur.id + '',
          title: cur.name,
          children: compose(getLossByType(TYPES), getLossByMeasurement(cur.id))(
            loss.data
          )
        }
      ],
      []
    );

  return [
    {
      title: '损耗列表',
      key: 'lossId',
      children: getChildrenForMeasurements(measurements)
    }
  ];
};

export default {
  loadMeasurementLoss,
  getStatistics,
  getSingleStatistics
};
