import { fetch } from '../../lib/util';
import moment from 'moment';
const base = '/api';

export const getDiagram = site =>
  fetch(`${base}/cabinet-diagram`, { method: 'GET', query: { site } });

export const loadRecordLabour = circuitId => {
  // 查询异常报警
  let from = moment()
    .subtract(6, 'days')
    .startOf('day')
    .format('YYYY-MM-DD HH:mm:ss');
  let to = moment()
    .endOf('day')
    .format('YYYY-MM-DD HH:mm:ss');
  return fetch(`${base}/record`, {
    method: 'GET',
    query: {
      circuit: circuitId,
      sourceType: '0',
      disappear: 'false',
      from,
      to,
      size: '200',
      page: '1'
    }
  });
};
