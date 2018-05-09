import { fetch } from 'lib/util';
import { maxSize } from 'constants/const';

const url = '/api/projekt';

export const getMeasurements = async query => {
  let json = await fetch(`${url}/measurement`, {
    method: 'GET',
    query
  });
  return json.content || [];
};

export const getMeasurement = async measurementId => {
  let json = await fetch(`${url}/measurement/${measurementId}`, {
    method: 'GET'
  });
  return json;
};
