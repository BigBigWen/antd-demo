import { fetch } from '../../lib/util';
import { TableEventTypeOptions } from '../../constants/options';

const base = '/api';

export const getAlarm = async params => {
  const data = await fetch(`${base}/record`, {
    method: 'GET',
    query: params
  });
  return {
    data: data.content || [],
    total: data.total
  };
};

export const loadRecordLabour = async params => {
  // 查询安全隐患
  let json = await fetch(`${base}/record`, {
    method: 'GET',
    query: {
      ...params,
      sourceType: '1'
    }
  });
  return {
    data: (json.content || []).map(point => ({
      projectName: point.project.name,
      siteName: point.siteObj.name,
      name: point.name,
      eventType: (
        TableEventTypeOptions.find(a => a.value === point.eventType) || {}
      ).label,
      circuit: point.circuit,
      description: point.description,
      appearRecordTime: point.appearRecordTime,
      disappearRecordTime: point.disappearRecordTime,
      key: point.key,
      pair: point.pair,
      site: point.site,
      ticketId: point.ticketId
    })),
    total: json.total
  };
};

export const loadSuggestions = async params => {
  // 查询建议措施
  let json = await fetch(`${base}/edx-suggestion`, {
    method: 'GET',
    query: {
      ...params,
      site: params.site
    }
  });
  return {
    data: (json.content || []).map(point => ({
      id: point.id,
      name: point.type,
      eventType: point.description,
      projectName: point.project.name,
      siteName: point.site.name,
      circuit: point.circuit.name,
      appearRecordTime: point.time,
      key: point.id
    })),
    total: json.total
  };
};

export const delSuggestion = id => {
  // 删除建议措施
  return fetch(`${base}/edx-suggestion`, {
    method: 'DELETE',
    query: { id: id }
  });
};

export const postRecordDisappear = (key, pair, site) => {
  // 确认恢复安全隐患
  return fetch(`${base}/record-disappear`, {
    method: 'POST',
    query: {
      key: key,
      pair: pair,
      site
    }
  });
};

export const postRecord = data => {
  // 修改安全隐患
  return fetch(`${base}/manual-event`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
};
export const postSuggestion = data => {
  // 新增建议措施
  return fetch(`${base}/edx-suggestion`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
};

// todo KIN-1272
export const loadAsset = async params => {
  let query = { ...params };
  params.siteId ? (query.siteId = params.siteId[0]) : '';
  if (query.siteId) {
    let json =
      (await fetch(`${base}/edx-asset`, {
        method: 'GET',
        query: { ...query }
      })) || {};
    return {
      data: json.content || [{ circuitName: 'mock' }],
      total: json.total || 1
    };
  } else {
    return {
      data: [],
      total: 0
    };
  }
};
export const deleteAsset = id => {
  return fetch(`${base}/edx-asset`, {
    method: 'DELETE',
    query: { id }
  });
};

export const loadReport = async params => {
  let query = { ...params };
  params.siteId ? (query.siteId = params.siteId[0]) : '';
  let json = await fetch(`${base}/edx-report`, {
    method: 'GET',
    query: { ...query }
  });
  return {
    data: json.content || [],
    total: json.total
  };
};
export const deleteReport = id => {
  return fetch(`${base}/edx-report`, {
    method: 'DELETE',
    query: { id }
  });
};
export const addReport = data => {
  return fetch(`${base}/edx-report`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
};

// 确认已读异常报警
export const readRecord = (key, pair, site) =>
  fetch(`${base}/record-read`, {
    method: 'POST',
    query: {
      key,
      pair,
      site
    }
  });
