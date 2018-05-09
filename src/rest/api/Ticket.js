import moment from 'moment';
import { fetch, fetchBlob } from 'lib/util';
import { dateUnitDict } from 'constants/const';
export { getUser } from './User'; // 工单二期再整理

const base = '/api/ticket';
const url = '/api';

export const generateTicket = (key, pair, siteId) => {
  return fetch(`${url}/record-ticket`, {
    method: 'POST',
    query: {
      key: key,
      pair: pair,
      site: siteId
    }
  });
};

export const getRepairTicket = params => {
  return fetch(`${base}/repair/ticket`, {
    method: 'GET',
    query: {
      ...params,
      sort: 'updateTime,desc'
    }
  });
};

export const postRepairAction = (id, action) =>
  fetch(`${base}/repair/ticket/${id}/action`, {
    method: 'POST',
    body: JSON.stringify({ ...action })
  });

export const postRepairSupplement = (id, actionForm) =>
  fetch(`${base}/repair/ticket/${id}/receipt`, {
    method: 'POST',
    body: JSON.stringify({ ...actionForm })
  });

export const getRepairDetail = (id, failure) =>
  fetch(`${base}/repair/ticket/${id}`, { method: 'GET' });

export const getRepairTicketNumber = id =>
  fetch(`${base}/repair/ticket/${id}/page`, { method: 'GET' });

export const getInspectionTicket = (params, failure) =>
  fetch(`${base}/inspection/ticket`, {
    method: 'GET',
    query: { ...params, sort: 'updateTime,desc' }
  });

export const postInspectionAction = (id, action) =>
  fetch(`${base}/inspection/ticket/${id}/action`, {
    method: 'POST',
    body: JSON.stringify({ ...action })
  });

export const postInspectionSupplement = (id, actionForm) =>
  fetch(`${base}/inspection/ticket/${id}/receipt`, {
    method: 'POST',
    body: JSON.stringify({ ...actionForm })
  });

export const getInspectionDetail = (id, failure) =>
  fetch(`${base}/inspection/ticket/${id}`, { method: 'GET' });

export const getInspectionTicketNumber = id =>
  fetch(
    `${base}/inspection/ticket/${id}/page`,
    { method: 'GET' },
    json => json
  );

export const getStatCount = async params => {
  let json = await fetch(`${base}/stat/count`, {
    method: 'GET',
    query: { ...params, sort: 'createTime,asc' }
  });
  return {
    data: (json.content || []).map((i, ind) => {
      return Object.keys(i).reduce(
        (prev, cur) => {
          prev[cur] = cur === 'worker' ? i[cur] : i[cur] || 0;
          return prev;
        },
        { key: ind }
      );
    }),
    total: json.toal || json.totalElements // 未来只有total
  };
};

export const getStatDuration = async params => {
  let json = await fetch(`${base}/stat/duration`, {
    method: 'GET',
    query: { ...params, sort: 'createTime,asc' }
  });
  return {
    data: (json.content || []).map((i, ind) => {
      return Object.keys(i).reduce(
        (prev, cur) => {
          prev[cur] = cur === 'worker' ? i[cur] : parseInt(i[cur] / 60000) || 0;
          return prev;
        },
        { key: ind }
      );
    }),
    total: json.total
  };
};

// 获取工单数列表数据接口
export const exportWorkSheet = () => {
  return fetchBlob(`${base}/stat/count/export`, {
    method: 'GET',
    filename: '工单数',
    'Content-Type': 'application/vnd.ms-excel'
  });
};

// 获取工单时长列表数据接口
export const exportWorkHourSheet = () => {
  return fetchBlob(`${base}/stat/duration/export`, {
    method: 'GET',
    filename: '工单时长',
    'Content-Type': 'application/vnd.ms-excel'
  });
};

export const loadInspectionPlan = async params => {
  let json = await fetch(`${base}/inspection/plan`, {
    method: 'GET',
    query: { ...params }
  });
  let data = (json.content || []).map(item => ({
    key: item.id,
    id: item.id,
    name: item.name,
    period: item.period + dateUnitDict[item.unit],
    state: item.state,
    firstTime: moment(item.firstTime).format('YYYY-MM-DD'),
    project: (item.project || {}).name,
    count: item.count ? `第${item.count}次巡检` : '--'
  }));
  return {
    data,
    total: json.totalElements
  };
};

export const loadInspectionPlanDetail = async id =>
  fetch(`${base}/inspection/plan/${id}`, { method: 'GET' });

export const postInspectionPlan = async data =>
  fetch(`${base}/inspection/plan`, {
    method: 'POST',
    body: JSON.stringify(data)
  });

export const putInspectionPlan = async data =>
  fetch(`${base}/inspection/plan/${data.id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });

export const shutDownPlan = id =>
  fetch(`${base}/inspection/plan/${id}/shutdown`, { method: 'GET' });

export const reStartPlan = id =>
  fetch(`${base}/inspection/plan/${id}/resume`, { method: 'GET' });
