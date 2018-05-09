import { fetch } from '../../lib/util';

const base = '/api';

export const postLogin = async userInfo => {
  let data = await fetch(`${base}/authorize`, {
    method: 'POST',
    body: userInfo
  });
  return data;
};

export const getLogin = async () => {
  let data = await fetch(`${base}/authorize`, {
    method: 'GET'
  });
  return data;
};

export const deleteLogin = async () => {
  let res = await fetch(`${base}/authorize`, {
    method: 'DELETE'
  });
  return res;
};
