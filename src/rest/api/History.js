import { fetch } from 'lib/util';
import moment from 'moment';
import {
  numLabel,
  compose,
  billFactor,
  gettotal,
  getMax,
  getMin
} from 'lib/helper';

const historyUrl = '/api/statistics/history';
// Card需要发请求才能拿到数据的页面,把请求单独拎出来了,页面只需要一个请求就可以拿到全部数据的放在loadHistoryData
const timeDict = {
  H: {
    format: val => moment(val).format('HH') + ':00',
    sameLevel: 'day',
    sliceEnd: moment().format('HH') - 0 + 1
  },
  D: {
    format: val => moment(val).format('MM-DD'),
    sameLevel: 'month',
    sliceEnd: moment().format('DD') - 0
  },
  M: {
    format: val => moment(val).format('YYYY-MM'),
    sameLevel: 'year',
    sliceEnd: moment().format('MM') - 0
  }
};

const transformTableData = (data, aggrby) =>
  data.reduce((prev, cur) => {
    return cur.data.map((i, index) => ({
      ...(prev[index] || {}),
      ts: i[0],
      [cur.name]: numLabel(i[1]),
      time: timeDict[aggrby].format(i[0])
    }));
  }, []);

const transformChartData = (data, aggrby) =>
  data.map(i => ({
    name: i.name,
    data: i.data.map((j, index) => [
      aggrby === 'H' ? j[0] : index,
      Array.isArray(j[1])
        ? compose(
            arr => arr.map(i => numLabel(i)),
            arr => arr.sort((a, b) => a - b),
            arr => arr.filter(i => i !== null)
          )(j[1])
        : numLabel(j[1])
    ])
  }));

const isSameTimeLevel = (end, aggrby) =>
  moment(end).isSame(moment(), timeDict[aggrby].sameLevel);

const initialData = {
  data: {
    chartData: [],
    tableData: []
  }
};
const getReduce = arr => getMax(arr) - getMin(arr);
const getFengGuReta = arr =>
  numLabel((getMax(arr) - getMin(arr)) / getMax(arr) * 100);

export const loadHistoryData = async query => {
  if (!query.aggrLevel || !query.aggrLevelKey) {
    return initialData;
  }
  try {
    const json = await fetch(
      `${historyUrl}/${query.aggrLevel}/${query.aggrLevelKey}/${
        query.pointCategory
      }`,
      {
        method: 'GET',
        query: {
          tsStart: query.tsStart,
          tsEnd: query.tsEnd,
          name: query.name,
          aggrby: query.aggrby
        }
      }
    );
    const resData = Array.isArray(json) ? json : [];
    const tableData = transformTableData(resData, query.aggrby);
    const chartData = transformChartData(resData, query.aggrby);
    let cardData = {};
    query.name.forEach(a => {
      cardData[`min${a}`] = getMin(resData[0].data);
      cardData[`max${a}`] = getMax(resData[0].data);
    });
    return {
      data: {
        chartData,
        cardData,
        tableData: isSameTimeLevel(query.end, query.aggrby)
          ? tableData.slice(0, timeDict[query.aggrby].sliceEnd)
          : tableData
      }
    };
  } catch (err) {
    return initialData;
  }
};
export const loadEpData = async query => {
  if (!query.aggrLevel || !query.aggrLevelKey) {
    return initialData;
  }
  const [json, jfpgData] = await Promise.all([
    fetch(
      `${historyUrl}/${query.aggrLevel}/${query.aggrLevelKey}/${
        query.pointCategory
      }`,
      {
        method: 'GET',
        query: {
          tsStart: query.tsStart,
          tsEnd: query.tsEnd,
          name: query.name,
          aggrby: query.aggrby
        }
      }
    ),
    fetch(
      `${historyUrl}/${query.aggrLevel}/${query.aggrLevelKey}/${
        query.pointCategory
      }`,
      {
        method: 'GET',
        query: {
          tsStart: query.tsStart,
          tsEnd: query.tsEnd,
          name: ['EP1', 'EP2', 'EP3', 'EP4'],
          aggrby: query.aggrby
        }
      }
    )
  ]);

  const resData = Array.isArray(json) ? json : [];
  const tableData = transformTableData(resData, query.aggrby);
  const chartData = transformChartData(resData, query.aggrby);
  return {
    data: {
      chartData,
      cardData: {
        EP1: gettotal(jfpgData[0].data),
        EP2: gettotal(jfpgData[1].data),
        EP3: gettotal(jfpgData[2].data),
        EP4: gettotal(jfpgData[3].data),
        totalEP: gettotal(resData[0].data)
      },
      tableData: isSameTimeLevel(query.end, query.aggrby)
        ? tableData.slice(0, timeDict[query.aggrby].sliceEnd)
        : tableData
    }
  };
};
export const loadPData = async query => {
  if (!query.aggrLevel || !query.aggrLevelKey) {
    return initialData;
  }

  const [json, PavgData] = await Promise.all([
    fetch(
      `${historyUrl}/${query.aggrLevel}/${query.aggrLevelKey}/${
        query.pointCategory
      }`,
      {
        method: 'GET',
        query: {
          tsStart: query.tsStart,
          tsEnd: query.tsEnd,
          name: query.name,
          aggrby: query.aggrby
        }
      }
    ),
    fetch(
      `${historyUrl}/${query.aggrLevel}/${query.aggrLevelKey}/${
        query.pointCategory
      }`,
      {
        method: 'GET',
        query: {
          tsStart: query.tsStart,
          tsEnd: query.tsEnd,
          name: query.name,
          aggrby: query.aggrby === 'H' ? 'D' : query.aggrby === 'D' ? 'M' : ''
        }
      }
    )
  ]);

  const resData = Array.isArray(json) ? json : [];
  const tableData = transformTableData(resData, query.aggrby);
  const chartData = transformChartData(resData, query.aggrby);
  return {
    data: {
      chartData,
      cardData: {
        maxP: getMax(resData[0].data),
        minP: getMin(resData[0].data),
        Pavg: PavgData[0].data[0][1] || '--',
        fengGuReduce: getReduce(resData[0].data),
        fengGuReta: getFengGuReta(resData[0].data)
      },
      tableData: isSameTimeLevel(query.end, query.aggrby)
        ? tableData.slice(0, timeDict[query.aggrby].sliceEnd)
        : tableData
    }
  };
};
export const loadCOSQData = async query => {
  if (!query.aggrLevel || !query.aggrLevelKey) {
    return initialData;
  }
  const [json, COSQavgData] = await Promise.all([
    fetch(
      `${historyUrl}/${query.aggrLevel}/${query.aggrLevelKey}/${
        query.pointCategory
      }`,
      {
        method: 'GET',
        query: {
          tsStart: query.tsStart,
          tsEnd: query.tsEnd,
          name: query.name,
          aggrby: query.aggrby
        }
      }
    ),
    fetch(
      `${historyUrl}/${query.aggrLevel}/${query.aggrLevelKey}/${
        query.pointCategory
      }`,
      {
        method: 'GET',
        query: {
          tsStart: query.tsStart,
          tsEnd: query.tsEnd,
          name: query.name,
          aggrby: query.aggrby === 'H' ? 'D' : query.aggrby === 'D' ? 'M' : ''
        }
      }
    )
  ]);

  const resData =
    Array.isArray(json) && json.length ? json : [{ name: '', data: [] }];
  const tableData = transformTableData(resData, query.aggrby);
  const chartData = transformChartData(resData, query.aggrby);
  const COSQavg =
    COSQavgData && COSQavgData.length
      ? COSQavgData[0].data[0][1] || '--'
      : '--';
  return {
    data: {
      chartData,
      cardData: {
        COSQmax: getMax(resData[0].data),
        COSQmin: getMin(resData[0].data),
        COSQavg,
        electricityCoe: billFactor(COSQavg)
      },
      tableData: isSameTimeLevel(query.end, query.aggrby)
        ? tableData.slice(0, timeDict[query.aggrby].sliceEnd)
        : tableData
    }
  };
};
