import { fetch } from 'lib/util';
const base = '/api/projekt';

export const loadSites = async query => {
  let json = await fetch(`${base}/site`, {
    method: 'GET',
    query
  });
  return json.content || [];
};
