import { loadProjects } from 'rest/api/Project';
import { getMeasurements } from 'rest/api/Measurement';
import { loadEnergyOverview } from '../api/EnergyOverview';

export default {
  loadProjects,
  loadMeasurements: getMeasurements,
  loadEnergyOverview
};
