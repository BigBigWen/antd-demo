import { fetch } from 'lib/util';
import moment from 'moment';
import { numLabel, percentLabel } from 'lib/helper';

const otherUrl = '/api';
const url = '/api/loss';

const fillData = data =>
  Array.from({ length: 9 }, (_, i) => i).map(
    i => (data[i] ? data[i] : { name: '', lossRate: '--', lossAmount: '--' })
  );

export const getOverview = async projectId => {
  const json =
    (await fetch(`${url}/overview`, {
      method: 'GET',
      query: { projectId }
    })) || {};
  return {
    economicLoss: json.economicLoss,
    moreLossRate: percentLabel(json.moreLossRate),
    monthOverMonth: percentLabel(json.monthOverMonth),
    totalAmount: json.totalAmount,
    totalRate: percentLabel(json.totalRate),
    amountByDay: Array.isArray(json.amountByDay)
      ? json.amountByDay.map(i => [moment(i[0]).format('D'), numLabel(i[1])])
      : Array.from(
          {
            length: moment()
              .add(-1, 'month')
              .daysInMonth()
          },
          (_, ind) => ind
        ).map(i => [i, '--']),
    rateByDay: Array.isArray(json.rateByDay)
      ? json.rateByDay.map(i => [moment(i[0]).format('D'), percentLabel(i[1])])
      : Array.from(
          {
            length: moment()
              .add(-1, 'month')
              .daysInMonth()
          },
          (_, ind) => ind
        ).map(i => [i, '--'])
  };
};

export const getRank = async (id, { lossType, orderType }) => {
  const json = await fetch(`${url}/rank`, {
    method: 'GET',
    query: {
      projectId: id,
      lossType,
      orderType,
      size: 9
    }
  });
  return Array.isArray(json) && json.length
    ? fillData(json)
        .reverse()
        .map(i => ({
          name: i.name,
          lossAmount: numLabel(i.lossAmount),
          lossRate: percentLabel(i.lossRate)
        }))
    : [];
};

export const getLoss = async query => {
  let data = await fetch(`${url}/`, {
    method: 'GET',
    query
  });
  return {
    data: data.content || [],
    total: data.totalElements,
    numberOfElements: data.numberOfElements
  };
};

export const deleteLoss = id => {
  return fetch(`${url}/${id}`, { method: 'DELETE' });
};

export const addLoss = data => {
  return fetch(`${url}/`, {
    method: 'POST',
    body: JSON.stringify({ ...data })
  });
};

export const upDateLoss = (id, data) => {
  return fetch(`${url}/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ ...data })
  });
};

export const lossAutoCreate = async projectId => {
  const json = await fetch(`${url}/autocreate`, {
    method: 'POST',
    query: { projectId }
  });
  return json;
};

export const loadMeasurementCircuitTree = async projectId => {
  const json = await fetch(`${otherUrl}/tree-measurement-circuit`, {
    method: 'GET',
    query: { project: projectId }
  });
  const content = json.content || [];
  const tree = (content[0] || {}).tree || [];
  return tree.map(item => {
    return {
      label: item.measurement.name,
      value: `${item.measurement.id}_MEASUREMENT`,
      children: getChildren(item.circuits)
    };
  });
};

const getChildren = data => {
  return data.map(
    circuit =>
      circuit.circuits && circuit.circuits.length
        ? {
            label: circuit.name,
            value: `${circuit.id}_CIRCUIT`,
            children: getChildren(circuit.circuits)
          }
        : {
            label: circuit.name,
            value: `${circuit.id}_CIRCUIT`
          }
  );
};

export const getStatistics = async query => {
  if (!query.lossId.filter(i => i).length) {
    return { chartData: [], tableData: [] };
  }
  let json = await fetch(`${url}/statistics`, {
    method: 'POST',
    body: JSON.stringify({
      ...query,
      lossId: (query.lossId || []).map(d => d - 0)
    })
  });
  const resData = Array.isArray(json) ? json : [];
  const getHours = ind => (ind <= 9 ? `0${ind}:00` : `${ind}:00`);
  const getDays = (ind, ts) =>
    ind <= 9
      ? `${moment(ts).format('MM')}-0${ind}`
      : `${moment(ts).format('MM')}-${ind}`;
  const getMonth = (ind, ts) =>
    ind <= 9
      ? `${moment(ts).format('YYYY')}-0${ind}`
      : `${moment(ts).format('YYYY')}-${ind}`;
  const transfromTableData = resData.map(i =>
    i.map((j, ind) => ({
      id: j.id,
      name: j.name,
      amount: numLabel(j.amount),
      rate: percentLabel(j.rate),
      ts: j.ts,
      time:
        query.interval === 'DAY'
          ? getHours(ind - 0)
          : query.interval === 'MONTH'
            ? getDays(ind + 1, query.from)
            : getMonth(ind + 1, query.from)
    }))
  );
  return {
    data: {
      chartData: transfromTableData,
      tableData: moment(query.to).isSame(
        moment(),
        query.interval === 'DAY'
          ? 'day'
          : query.interval === 'MONTH' ? 'month' : 'year'
      )
        ? (transfromTableData[0] || []).slice(
            0,
            query.interval === 'DAY'
              ? moment().format('HH') - 0 + 1
              : query.interval === 'MONTH'
                ? moment().format('DD') - 0
                : moment().format('MM') - 0
          )
        : transfromTableData[0]
    }
  };
};

export const getBlockData = async query => {
  if (!query.lossId || !query.lossId[0]) return;
  let json = await fetch(`${url}/block-data/loss/${query.lossId[0]}`, {
    method: 'POST',
    body: JSON.stringify({
      from: query.from,
      to: query.to,
      name: 'loss'
    })
  });
  return {
    economicLoss: numLabel(json.economicLoss, 0),
    theoryRate: percentLabel(json.theoryRate),
    monthOverMonth: percentLabel(json.monthOverMonth),
    totalAmount: numLabel(json.totalAmount),
    totalRate: percentLabel(json.totalRate)
  };
};

export const getSingleStatistics = async query => {
  let [statistics, blockData] = await Promise.all([
    getStatistics(query),
    getBlockData(query)
  ]);
  return {
    data: {
      ...statistics.data,
      blockData
    }
  };
};
