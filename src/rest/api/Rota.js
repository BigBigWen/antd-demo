import { fetch } from 'lib/util';
import qs from 'query-string';

const url = '/api/ticket';
export const getRota = params =>
  fetch(`${url}/rota`, { method: 'GET', query: { ...params } });

export const getRotaPlan = () => fetch(`${url}/rota/plan`, { method: 'GET' });

export const createRotaPlan = form =>
  fetch(`${url}/rota/plan`, {
    method: 'POST',
    body: JSON.stringify(form)
  });

export const putRotaPlan = (id, form) =>
  fetch(`${url}/rota/plan/${id}`, {
    method: 'PUT',
    body: JSON.stringify(form)
  });

export const deleteRotaPlan = id =>
  fetch(`${url}/rota/plan/${id}`, { method: 'DELETE' });

export const generateRota = (params, confirm) =>
  fetch(
    `${url}/rota/generate?${qs.stringify(params)}`,
    { method: 'GET', query: { ...params } }
    // {
    //   2022: confirm
    // }
  );

export const clearRota = params =>
  fetch(`${url}/rota/clear`, { method: 'GET', query: { ...params } });
export const changeRota = (id, targetUserId) =>
  fetch(`${url}/rota/${id}/change`, {
    method: 'GET',
    query: {
      targetUserId
    }
  });
