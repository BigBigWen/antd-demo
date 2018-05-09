import {
  loadEPAnalysis,
  loadElectricityAnalysis,
  loadForecastType,
  loadLoadAnalysis,
  loadCOSQ,
  loadEPMakeUp,
  loadEPByTime
} from '../api/Energy';
import { getMeasurements } from '../api/Measurement';

const loadTreeData = async projectId => {
  if (!projectId) {
    return [
      {
        title: '计费进线列表',
        key: 'measurement',
        children: []
      }
    ];
  }
  let measurements = await getMeasurements({ projectId });
  return [
    {
      title: '计费进线列表',
      key: 'measurement',
      children: measurements.map(a => {
        return { ...a, key: a.id + '', title: a.name, type: 'measurement' };
      })
    }
  ];
};

export default {
  loadTreeData,
  loadEPAnalysis,
  loadElectricityAnalysis,
  loadForecastType,
  loadLoadAnalysis,
  loadCOSQ,
  loadEPMakeUp,
  loadEPByTime
};
