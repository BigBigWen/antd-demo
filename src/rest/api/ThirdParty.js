import { fetch } from '../../lib/util';

const base = '/api/thirdparty';

export const getAliToken = async () => {
  return fetch(`${base}/sts`, { method: 'GET' });
};
