import { fetch } from 'lib/util';
import { numLabel, mom, percentLabel } from 'lib/helper';
import { isNumber } from 'util';
import moment from 'moment';

const energyUrl = '/api/statistics/energy';
const historyUrl = '/api/statistics/history';

// 用电构成
export const loadEnergyOverview = async measurementId => {
  if (measurementId) {
    const json = await fetch(
      `${energyUrl}/measurement/${measurementId}/overview`,
      { method: 'GET' }
    );
    let [
      curMonth,
      prevMonth,
      lastYearCurMonth,
      circuitData,
      PdmdData,
      yesterdayP,
      curP
    ] = await Promise.all([
      fetch(`${historyUrl}/measurement/${measurementId}/EP`, {
        method: 'GET',
        query: {
          tsStart: moment()
            .startOf('month')
            .valueOf(),
          tsEnd: moment()
            .endOf('month')
            .valueOf(),
          name: 'EP',
          aggrby: 'D'
        }
      }),
      fetch(`${historyUrl}/measurement/${measurementId}/EP`, {
        method: 'GET',
        query: {
          tsStart: moment()
            .subtract(1, 'M')
            .startOf('month')
            .valueOf(),
          tsEnd: moment()
            .subtract(1, 'M')
            .endOf('month')
            .valueOf(),
          name: 'EP',
          aggrby: 'D'
        }
      }),
      fetch(`${historyUrl}/measurement/${measurementId}/EP`, {
        method: 'GET',
        query: {
          tsStart: moment()
            .subtract(1, 'y')
            .startOf('month')
            .valueOf(),
          tsEnd: moment()
            .subtract(1, 'y')
            .endOf('month')
            .valueOf(),
          name: 'EP',
          aggrby: 'D'
        }
      }),
      fetch(`${energyUrl}/measurement/${measurementId}/EP`, {
        method: 'GET',
        query: {
          tsStart: moment()
            .startOf('month')
            .valueOf(),
          tsEnd: moment()
            .endOf('month')
            .valueOf(),
          name: 'EP',
          aggrby: ['D', 'circuit']
        }
      }),
      fetch(`${historyUrl}/measurement/${measurementId}/P`, {
        method: 'GET',
        query: {
          tsStart: moment()
            .startOf('month')
            .valueOf(),
          tsEnd: moment()
            .endOf('month')
            .valueOf(),
          name: 'Pdmd',
          aggrby: 'D'
        }
      }),
      fetch(`${historyUrl}/measurement/${measurementId}/P`, {
        method: 'GET',
        query: {
          tsStart: moment()
            .subtract(1, 'd')
            .startOf('day')
            .valueOf(),
          tsEnd: moment()
            .subtract(1, 'd')
            .endOf('day')
            .valueOf(),
          name: 'P',
          aggrby: 'D'
        }
      }),
      fetch(`${historyUrl}/measurement/${measurementId}/P`, {
        method: 'GET',
        query: {
          tsStart: moment()
            .startOf('day')
            .valueOf(),
          tsEnd: moment()
            .endOf('day')
            .valueOf(),
          name: 'P',
          aggrby: 'D'
        }
      })
    ]);

    const transfromNumber = data => (isNumber(data) ? numLabel(data) : 0);
    const transfromChartData = (data = []) =>
      data.map((a, ind) => [a[0], numLabel(a[1])]);
    const getCircuitData = (data = []) => {
      if (data.length > 7) {
        let res = data.slice(0, 7).map(jsonData => ({
          name: jsonData.name.name,
          value: jsonData.data.reduce(
            (pre, cur) => transfromNumber(cur[1]) + transfromNumber(pre[1]),
            0
          )
        }));
        res.push({
          name: '其他',
          data: data[data.length - 1].data.reduce(
            (pre, cur) => transfromNumber(cur[1]) + transfromNumber(pre[1]),
            0
          )
        });
        return res;
      } else {
        return data.map(jsonData => ({
          name: jsonData.name.name,
          value: jsonData.data.reduce(
            (pre, cur) => transfromNumber(cur[1]) + transfromNumber(pre[1]),
            0
          )
        }));
      }
    };
    return {
      data: {
        EPData: [
          { name: '本月', data: transfromChartData(curMonth[0].data) },
          { name: '上月', data: transfromChartData(prevMonth[0].data) },
          {
            name: '去年同期',
            data: transfromChartData(lastYearCurMonth[0].data)
          }
        ], // 用电量
        PData: [
          { name: '昨日', data: transfromChartData(yesterdayP[0].data) },
          { name: '今日', data: transfromChartData(curP[0].data) }
        ], // 用电功率
        circuitData: getCircuitData(circuitData), // 各回路用电占比
        PdmdData: [
          { name: '需量', data: transfromChartData(PdmdData[0].data) }
        ], // 需量柱状图
        epInMonth: numLabel(json.epInMonth), // 本月累计电量
        epInLastMonth: numLabel(json.epInLastMonth), // 上月同期累计电量
        epMoM: percentLabel(json.epMoM), // 环比
        pdmd: numLabel(json.pdmd), // 本月最大需量
        currentMonthManualPdmd: numLabel(json.currentMonthManualPdmd), // 申报需量
        powerFactorList: [
          {
            name: '功率因数',
            data: json.powerFactorList[0].data.map((a, ind) => [
              ind,
              numLabel(a[1])
            ])
          }
        ], // 功率因数的图
        powerFactor: numLabel(json.powerFactor), // 功率因数那个数字
        radarData: json.radarData // 雷达图
      }
    };
  }
};
