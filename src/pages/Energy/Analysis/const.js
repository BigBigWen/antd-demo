import API from 'rest/Energy/EnergyAnalysis';
import EPAnalysis from './components/EPAnalysis';
import EPByTime from './components/EPByTime';
import ElectricityAnalysis from './components/ElectricityAnalysis';
import ForecastType from './components/ForecastType';
import EPByCircuit from './components/EPByCircuit';
import LoadAnalysis from './components/LoadAnalysis';
import COSQAnalysis from './components/COSQAnalysis';

const {
  loadEPAnalysis,
  loadElectricityAnalysis,
  loadForecastType,
  loadLoadAnalysis,
  loadCOSQ,
  loadEPMakeUp,
  loadEPByTime
} = API;

export const tabs = [
  {
    key: '电量分析',
    aggrLevel: 'measurement',
    getAction: loadEPAnalysis,
    dateBtn: ['H', 'D', 'M'],
    defaultDate: 'H',
    defaultSelectBtn: 'H',
    component: EPAnalysis
  },
  {
    key: '用电构成',
    aggrLevel: 'measurement',
    getAction: loadEPMakeUp,
    dateBtn: ['D', 'M'],
    defaultDate: 'D',
    defaultSelectBtn: 'D',
    component: EPByCircuit,
    tableData: {
      columnsNum: 1,
      configData: [
        { title: '序号', col: 4, key: 'id' },
        { title: '回路名称', col: 5, key: 'circuitName' },
        { title: '电量(KW)', col: 5, key: 'value' },
        { title: '电量占比(%)', col: 5, key: 'valueRatio' },
        { title: '环比(%)', col: 5, key: 'QOQ' }
      ]
    }
  },
  {
    key: '分时电量',
    aggrLevel: 'measurement',
    getAction: loadEPByTime,
    dateBtn: ['H', 'D', 'M'],
    defaultDate: 'H',
    defaultSelectBtn: 'H',
    component: EPByTime
  },
  {
    key: '电费分析',
    aggrLevel: 'measurement',
    getAction: loadElectricityAnalysis,
    dateBtn: ['M'],
    defaultDate: 'M',
    defaultSelectBtn: 'M',
    component: ElectricityAnalysis,
    tableData: {
      columnsNum: 1,
      configData: [
        { title: '日期', col: 4, key: 'time' },
        { title: '总电费', col: 4, key: 'payment' },
        { title: '总电费环比', col: 4, key: 'paymentMomGrowth' },
        { title: '总电费同比', col: 3, key: 'paymentYoyGrowth' },
        { title: '基本电费', col: 3, key: 'basicEnergyPayment' },
        { title: '力调电费', col: 3, key: 'cosqBaseEnergyPayment' },
        { title: '电度电费', col: 3, key: 'epBaseEnergyPayment' }
      ]
    }
  },
  {
    key: '报装方式',
    aggrLevel: 'measurement',
    getAction: loadForecastType,
    dateBtn: ['M'],
    defaultDate: 'M',
    defaultSelectBtn: 'M',
    component: ForecastType
  },
  {
    key: '负载分析',
    aggrLevel: 'measurement',
    getAction: loadLoadAnalysis,
    dateBtn: ['H', 'D'],
    defaultDate: 'H',
    defaultSelectBtn: 'H',
    component: LoadAnalysis,
    cardData: [
      {
        cardName: '轻载时长',
        key: 'lightLoadDuration',
        unit: '小时'
      },
      {
        cardName: '轻载占比',
        key: 'lightLoadRatio',
        unit: '%'
      },
      {
        cardName: '正常时长',
        key: 'normalDuration',
        unit: '小时'
      },
      {
        cardName: '正常占比',
        key: 'normalRatio',
        unit: '%'
      }
    ]
  },
  {
    key: '功率因数',
    aggrLevel: 'measurement',
    getAction: loadCOSQ,
    dateBtn: ['M'],
    defaultDate: 'M',
    defaultSelectBtn: 'M',
    component: COSQAnalysis,
    tableData: {
      columnsNum: 1,
      configData: [
        { title: '日期', col: 5, key: 'time' },
        { title: '有功电量(KWh)', col: 5, key: 'EP' },
        { title: '无功电量(KWh)', col: 5, key: 'EQ' },
        { title: '平均功率因数', col: 5, key: 'COSQ' },
        { title: '月电费系数', col: 4, key: 'ChargeFactor' }
      ]
    }
  }
];
