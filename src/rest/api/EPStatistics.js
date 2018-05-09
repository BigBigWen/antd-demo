import { fetch, fetchBlob } from 'lib/util';
import { numLabel, getTime } from 'lib/helper';
import moment from 'moment';

const url = '/api/statistics/history';
const energUrl = '/api/statistics/energy';

const transformChartData = data =>
  data.map(i => ({
    name: i.name.name,
    stack: 'EP',
    data: i.data.map((j, index) => [index, numLabel(j[1])])
  }));

const getResData = (json = []) => {
  let initialArr = json.slice(0, 7);
  initialArr.push(json[json.length - 1]);
  return initialArr;
};

// 公司
export const loadEPBaseCompany = async query => {
  if (query.groupId || query.groupId === 0) {
    const json = await fetch(`${url}/group/${query.groupId}/EP`, {
      method: 'GET',
      query: {
        tsStart: query.tsStart,
        tsEnd: query.tsEnd,
        name: query.name,
        aggrby: query.aggrby
      }
    });
    return {
      data: {
        chartData: [
          {
            name: '总计',
            data: (json || [])[0].data.map((a, ind) => [ind, numLabel(a[1])])
          }
        ]
      }
    };
  } else {
    return {
      data: {
        chartData: []
      }
    };
  }
};
// 项目
export const loadEPBaseProject = async query => {
  if (query.groupId || query.groupId === 0) {
    const json = await fetch(`${energUrl}/group/${query.groupId}/EP`, {
      method: 'GET',
      query: {
        tsStart: query.tsStart,
        tsEnd: query.tsEnd,
        name: 'EP',
        aggrby: [query.aggrby, 'project']
      }
    });
    return {
      data: {
        chartData: transformChartData(json.length > 7 ? getResData(json) : json)
      }
    };
  } else {
    return {
      data: {
        chartData: []
      }
    };
  }
};

// 回路,计费进线
export const loadEPDataEnergy = async query => {
  if (query.aggrLevelKey && query.aggrLevel) {
    const json = await fetch(
      `${energUrl}/${query.aggrLevel}/${query.aggrLevelKey}/EP`,
      {
        method: 'GET',
        query: {
          tsStart: query.tsStart,
          tsEnd: query.tsEnd,
          aggrby: [query.aggrby, query.type]
        }
      }
    );
    return {
      data: {
        chartData: transformChartData(json.length > 7 ? getResData(json) : json)
      }
    };
  } else {
    return {
      data: {
        chartData: []
      }
    };
  }
};
// 生成报表
export const exportEP = async data => {
  const time = getTime(data.mode, data.time);
  const typeName = {
    circuit: '回路',
    project: '项目',
    mesurement: '计费进线',
    group: '公司'
  };
  const periodName = {
    H: '小时',
    D: '天',
    M: '月',
    Y: '年'
  };
  let json = await fetchBlob(`${energUrl}/${data.type}/EP/export`, {
    method: 'GET',
    query: {
      tsStart: time.tsStart,
      tsEnd: time.tsEnd,
      name: 'EP',
      aggrby: data.mode
    },
    fileName: `${typeName[data.type]}${
      periodName[data.mode]
    }用电量统计报表${moment().format('YYYYMMDD')}.xlsx`
  });
};
