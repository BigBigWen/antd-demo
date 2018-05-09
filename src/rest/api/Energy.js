import { fetch } from 'lib/util';
import moment from 'moment';
import { numLabel, mom, compose, percentLabel, billFactor } from 'lib/helper';
import { isNumber } from 'util';
import { getMeasurement } from './Measurement';

const historyUrl = '/api/statistics/history';
const energyUrl = '/api/statistics/energy';
const timeDict = {
  H: {
    timeFormat: val => moment(val).format('HH:mm'),
    sameLevel: 'day',
    last: 'days',
    sliceEnd: moment().format('HH') - 0 + 1
  },
  D: {
    timeFormat: val => moment(val).format('MM-DD'),
    sameLevel: 'month',
    last: 'months',
    sliceEnd: moment().format('DD') - 0
  },
  M: {
    timeFormat: val => moment(val).format('YYYY-MM'),
    sameLevel: 'year',
    last: 'years',
    sliceEnd: moment().format('MM') - 0
  }
};
const transfromNumber = data => (isNumber(data) ? numLabel(data) : 0);
const transformChartData = (data, aggrby, stack) =>
  data.map(i => ({
    name: i.name,
    stack: stack || null,
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

// 电量分析页
export const loadEPAnalysis = async query => {
  let [cur, prev] = await Promise.all([
    fetch(`${historyUrl}/${query.aggrLevel}/${query.aggrLevelKey}/EP`, {
      method: 'GET',
      query: {
        tsStart: query.tsStart,
        tsEnd: query.tsEnd,
        name: 'EP',
        aggrby: query.aggrby
      }
    }),
    fetch(`${historyUrl}/${query.aggrLevel}/${query.aggrLevelKey}/EP`, {
      method: 'GET',
      query: {
        tsStart: moment(query.tsStart, 'x')
          .subtract(1, timeDict[query.aggrby].last)
          .valueOf(),
        tsEnd: moment(query.tsEnd, 'x')
          .subtract(1, timeDict[query.aggrby].last)
          .valueOf(),
        name: 'EP',
        aggrby: query.aggrby
      }
    })
  ]);
  const transformData = (data, aggrby, stack) =>
    data.map(i => ({
      name: i.name,
      stack: stack || null,
      data: i.data.map((j, index) => [
        j[0],
        Array.isArray(j[1])
          ? compose(
              arr => arr.map(i => numLabel(i)),
              arr => arr.sort((a, b) => a - b),
              arr => arr.filter(i => i !== null)
            )(j[1])
          : numLabel(j[1])
      ])
    }));
  let [current, last] = [
    transformData([{ data: cur[0].data, name: '本期' }]),
    transformData([{ data: prev[0].data, name: '上期' }])
  ];
  const tableData = (current[0].data || []).map((i, index) => {
    const date = moment(cur[0].data[index][0], 'x');
    return Object.assign(
      {},
      {
        ts: i[0],
        time: timeDict[query.aggrby].timeFormat(date),
        current: numLabel(i[1]),
        last: numLabel((last[0].data[index] || [0, 0])[1]), // ||[0,0]上期与本期x轴不一样的情况
        yoy: mom(i[1], (last[0].data[index] || [0, 0])[1]) + '%' // 同比
      },
      query.aggrby === 'H'
        ? {}
        : {
            mom: mom(
              i[1],
              index === 0
                ? last[0].data[last[0].data.length - 1][1]
                : current[0].data[index - 1][1]
            ) // 环比
          }
    );
  });
  return {
    data: {
      last,
      current,
      tableData
    }
  };
};
// 用电构成
export const loadEPMakeUp = async query => {
  const json = await fetch(`${energyUrl}/measurement/3/EP`, {
    method: 'GET',
    query: {
      aggrby: ['circuit', query.aggrby],
      tsStart: query.tsStart,
      tsEnd: query.tsEnd
    }
  });
  let barData = [];
  let pieData = [];
  let tableData = [];
  let resData = [];
  if (json.length > 8) {
    resData = json.slice(0, 8);
    resData.push(json[json.length - 1]);
  } else {
    resData = json || [];
  }
  resData.forEach((jsonData, jsonDataInd) => {
    barData.push({
      name: jsonData.name.name,
      stack: 'EP',
      data: jsonData.data.map((a, ind) => [ind, numLabel(a[1])])
    });
    pieData.push({
      name: jsonData.name.name,
      value: (jsonData.data || []).reduce(
        (pre, cur) => transfromNumber(cur[1]) + transfromNumber(pre[1]),
        0
      )
    });
  });
  json.slice(0, -1).forEach((jsonData, jsonDataInd) => {
    tableData.push({
      id: jsonDataInd + 1,
      circuitName: jsonData.name.name,
      value: (jsonData.data || []).reduce(
        (pre, cur) => transfromNumber(cur[1]) + transfromNumber(pre[1]),
        0
      )
    });
  });
  const totalEP = pieData.reduce(
    (pre, cur) => (Number(cur.value) || 0) + (Number(pre.value) || 0),
    0
  );
  return {
    data: {
      tableData: tableData.map(a => ({
        ...a,
        valueRatio: percentLabel(a.value / totalEP)
      })),
      barData,
      pieData,
      initial: pieData
    }
  };
};
// 分时电量
export const loadEPByTime = async query => {
  let jfpgName = [
    { name: 'EP1', label: '尖电量', value: 0, electricity: 0, price: 0 },
    { name: 'EP2', label: '峰电量', value: 0, electricity: 0, price: 0 },
    { name: 'EP3', label: '平电量', value: 0, electricity: 0, price: 0 },
    { name: 'EP4', label: '谷电量', value: 0, electricity: 0, price: 0 }
  ];
  const json = await fetch(
    `${historyUrl}/measurement/${query.aggrLevelKey}/EP`,
    {
      method: 'GET',
      query: {
        tsStart: query.tsStart,
        tsEnd: query.tsEnd,
        name: ['EP1', 'EP2', 'EP3', 'EP4'],
        aggrby: query.aggrby
      }
    }
  );
  const measurementDetail = await getMeasurement(query.aggrLevelKey);
  jfpgName[0].price = measurementDetail.jfpg.jianPrice;
  jfpgName[1].price = measurementDetail.jfpg.fengPrice;
  jfpgName[2].price = measurementDetail.jfpg.pingPrice;
  jfpgName[3].price = measurementDetail.jfpg.guPrice;
  const transformEPbyTime = (data, aggrby) =>
    data.map((i, ind) => {
      const currentEp = i.data.map((j, index) => [
        index,
        Array.isArray(j[1])
          ? compose(
              arr => arr.map(i => numLabel(i)),
              arr => arr.sort((a, b) => a - b),
              arr => arr.filter(i => i !== null)
            )(j[1])
          : numLabel(j[1])
      ]);
      let epValue = currentEp.reduce(
        (pre, cur) => transfromNumber(cur[1]) + transfromNumber(pre[1])
      );
      jfpgName[ind].value = epValue;
      jfpgName[ind].electricity = epValue * jfpgName[ind].price;
      return {
        name: jfpgName.find(a => a.name === i.name).label,
        stack: i.name,
        data: currentEp
      };
    });
  return {
    data: {
      mainChartData: transformEPbyTime(json, query.aggrby),
      leftChartData: jfpgName.map(a => ({ name: a.label, value: a.value })),
      rightChartData: jfpgName.map(a => ({
        name: a.label,
        value: a.electricity
      }))
    }
  };
};
// 电费分析页
export const loadElectricityAnalysis = async query => {
  let json = await fetch(
    `${energyUrl}/measurement/${query.aggrLevelKey}/bill/history`,
    {
      method: 'GET',
      query: {
        tsStart: query.tsStart,
        tsEnd: query.tsEnd,
        aggrby: 'M'
      }
    }
  );
  let chartData = [
    {
      name: '总电费',
      stack: 'allEP',
      data: (json || []).map((a, ind) => [ind, numLabel(a.payment)])
    },
    {
      name: '基本电费',
      stack: 'EP',
      data: (json || []).map((a, ind) => [ind, numLabel(a.basicEnergyPayment)])
    },
    {
      name: '力调电费',
      stack: 'EP',
      data: (json || []).map((a, ind) => [
        ind,
        numLabel(a.cosqBaseEnergyPayment)
      ])
    },
    {
      name: '电度电费',
      stack: 'EP',
      data: (json || []).map((a, ind) => [ind, numLabel(a.epBaseEnergyPayment)])
    }
  ];
  const tableData = (json || []).map((i, index) =>
    Object.assign(
      {},
      {
        time: `${i.year}-${i.month}`,
        ts: i.month,
        payment: numLabel(i.payment), // 总电费
        paymentMomGrowth: numLabel(i.paymentMomGrowth), // 电费月环比
        paymentYoyGrowth: numLabel(i.paymentYoyGrowth), // 电费同比
        basicEnergyPayment: numLabel(i.basicEnergyPayment), // 基础电费
        cosqBaseEnergyPayment: numLabel(i.cosqBaseEnergyPayment), // 力率调整电费
        epBaseEnergyPayment: numLabel(i.epBaseEnergyPayment) // 电度电费
      }
    )
  );
  return {
    data: {
      tableData,
      chartData
    }
  };
};

// 报装方式
export const loadForecastType = async query => {
  const json = await fetch(
    `${energyUrl}/measurement/${query.aggrLevelKey}/bill/forecast`,
    {
      method: 'GET',
      query: {
        tsStart: query.tsStart,
        tsEnd: query.tsEnd,
        aggrby: 'M'
      }
    }
  );
  let chartData = [
    {
      name: '按容计算',
      data: (json.meaReportedInstallations || []).map((a, ind) => [
        ind,
        numLabel(a.capacityPrice)
      ])
    },
    {
      name: '按需计算',
      data: (json.meaReportedInstallations || []).map((a, ind) => [
        ind,
        numLabel(a.demandPrice)
      ])
    }
  ];
  return {
    data: {
      chartData,
      capacity: numLabel(json.capacity), // 变压器容量
      capacityBased: numLabel(json.capacityBased), // 推荐
      capacityBasedPayment: numLabel(json.capacityBasedPayment), // 按容电费
      manualPdmd: numLabel(json.manualPdmd), // 本月申报需量
      maxPdmd: numLabel(json.maxPdmd), // 本月实际最大需量
      basicPayment: numLabel(json.basicPayment), // 基本电费
      maxPdmdBasedPayment: numLabel(json.maxPdmdBasedPayment), // 按需电费
      maxPdmdBased: numLabel(json.maxPdmdBased) // 推荐
    }
  };
};

// 负载分析
export const loadLoadAnalysis = async query => {
  const json = await fetch(
    `${energyUrl}/measurement/${query.aggrLevelKey}/load`,
    {
      method: 'GET',
      query: {
        tsStart: query.tsStart,
        tsEnd: query.tsEnd,
        aggrby: 'M'
      }
    }
  );
  return {
    data: {
      loadRatioData: [{ name: '负载率', data: json.loadValue || [] }], // 负载率
      loadData: [
        {
          name: '轻载',
          data: (json.hourValue || []).map(
            value => (value[0] < 40 ? value[1] : '--')
          )
        },
        {
          name: '正常',
          data: (json.hourValue || []).map(
            value => (value[0] >= 40 && value[0] < 80 ? value[1] : '--')
          )
        },
        {
          name: '重载',
          data: (json.hourValue || []).map(
            value => (value[0] >= 80 && value[0] <= 100 ? value[1] : '--')
          )
        },
        {
          name: '超载',
          data: (json.hourValue || []).map(
            value => (value[0] > 100 ? value[1] : '--')
          )
        }
      ], // 负载
      cardData: {
        lightLoadDuration: numLabel(json.lightLoadDuration),
        lightLoadRatio: percentLabel(json.lightLoadRatio),
        normalDuration: numLabel(json.normalDuration),
        normalRatio: percentLabel(json.normalRatio)
      }
    }
  };
};
// 功率因数
export const loadCOSQ = async query => {
  const json =
    (await fetch(`${historyUrl}/measurement/${query.aggrLevelKey}/EP`, {
      method: 'GET',
      query: {
        tsStart: query.tsStart,
        tsEnd: query.tsEnd,
        name: ['COSQ', 'EP', 'EQ'],
        aggrby: query.aggrby
      }
    })) || [];
  const EP = json.find(data => data.name === 'EP');
  const EQ = json.find(data => data.name === 'EQ');
  const COSQ = json.find(data => data.name === 'COSQ');
  const tableData = (COSQ.data || []).map((i, index) =>
    Object.assign(
      {},
      {
        time: moment(i[0], 'x').format('YYYY-MM'),
        ts: index,
        EP: numLabel(EP.data[index][1]),
        EQ: numLabel(EQ.data[index][1]),
        COSQ: numLabel(i[1]),
        ChargeFactor: billFactor(i[1])
      }
    )
  );
  return {
    data: {
      tableData,
      chartData: [
        {
          name: '功率因数',
          data: COSQ.data.map((a, ind) => [ind, numLabel(a[1])])
        }
      ]
    }
  };
};
