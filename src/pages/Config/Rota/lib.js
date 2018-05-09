import { inRange as range, isNil, mapValues, isNumber } from 'lodash';

export const inRange = (number, arr) => {
  if (arr.some(t => isNil(t)) || !isNumber(number)) {
    return false;
  }
  return range(number, ...arr) || number === arr[0] || number === arr[1];
};

export const createFormField = (obj, formFormat) =>
  mapValues(obj, value => formFormat({ value }));
