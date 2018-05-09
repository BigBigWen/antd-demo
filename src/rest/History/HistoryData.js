import {
  loadHistoryData,
  loadEpData,
  loadPData,
  loadCOSQData
} from '../api/History';
import { getCircuits } from '../api/Circuit';
import { getMeasurements } from '../api/Measurement';
import { loadSites } from '../api/Site';
import { maxSize } from 'constants/const';

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
  let [measurements, sites, circuits] = await Promise.all([
    getMeasurements({ projectId }),
    loadSites({ projectId, size: maxSize }),
    getCircuits({ projectId, size: maxSize })
  ]);
  let siteCircuitList = sites.map(i => ({
    key: i.id,
    title: i.name,
    children: circuits
      .filter(circuit => circuit.site.id === i.id)
      .map(circuit => ({
        ...circuit,
        key: circuit.id,
        title: circuit.name,
        type: 'circuit'
      }))
  }));
  return [
    {
      title: '计费进线列表',
      key: 'measurement',
      children: measurements.map(a => {
        return { ...a, key: a.id + '', title: a.name, type: 'measurement' };
      })
    },
    {
      title: '回路列表',
      key: 'circuit',
      children: siteCircuitList
    }
  ];
};

export default {
  loadTreeData,
  loadHistoryData,
  loadEpData,
  loadPData,
  loadCOSQData
};
