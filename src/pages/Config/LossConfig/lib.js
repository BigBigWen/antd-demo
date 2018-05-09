import { lossType } from './const';

export const transformData = data =>
  (data || []).map(item => {
    return Object.assign(
      { ...item },
      {
        type: (lossType.find(a => a.value === item.type) || {}).label,
        start: item.startMonitors.map(a => a.name).join('; '),
        end: item.endMonitors.map(a => a.name).join('; ')
      }
    );
  });
