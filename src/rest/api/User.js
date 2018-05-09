import { fetch } from 'lib/util';

const url = '/api';

export const getUser = groupId => {
  return fetch(`${url}/user-all?groupId=${groupId || ''}`, { method: 'GET' });
};
