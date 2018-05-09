import { fetch } from '../../lib/util';

const base = '/api/projekt';

export const getCitcuitPoints = async circuit => {
  const json = await fetch(`${base}/circuit/${circuit}/point`, {
    method: 'GET'
  });
  return {
    circuitsPoints: json.content || [],
    subscibePoints: (json.content || []).map(data => {
      if (data.hasOwnProperty('devicePoint')) {
        return data.key;
      }
    })
  };
};

export const getCircuits = async query => {
  const json = await fetch(`${base}/circuit`, {
    method: 'GET',
    query
  });
  return json.content || [];
};
