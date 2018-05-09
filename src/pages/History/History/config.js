import {
  getEPChart,
  getPdmdChart,
  getCOSQChart,
  getLineBoxplotChart
} from './lib';
import { palette } from 'Chart';
import API from 'rest/History/HistoryData';
const { loadHistoryData, loadEpData, loadPData, loadCOSQData } = API;

const measurementBtns = [
  {
    btnName: '电量',
    aggrLevel: 'measurement',
    getAction: loadEpData,
    pointCategory: 'EP',
    name: 'EP',
    getChartOption: getEPChart,
    dateBtn: ['H', 'D', 'M'],
    defaultDate: 'H',
    defaultSelectBtn: 'H',
    cardData: [
      {
        cardName: '总电量',
        key: 'totalEP',
        unit: 'kWh'
      },
      {
        cardName: '尖电量',
        key: 'EP1',
        unit: 'kWh'
      },
      {
        cardName: '峰电量',
        key: 'EP2',
        unit: 'kWh'
      },
      {
        cardName: '平电量',
        key: 'EP3',
        unit: 'kWh'
      },
      {
        cardName: '谷电量',
        key: 'EP4',
        unit: 'kWh'
      }
    ],
    tableData: {
      configData: [
        { title: '时间', col: 12, key: 'time' },
        { title: '总电量(kWh)', col: 12, key: 'EP' }
      ],
      columnsNum: 4
    }
  },
  {
    btnName: '需量',
    getAction: loadHistoryData,
    aggrLevel: 'measurement',
    pointCategory: 'P',
    name: 'Pdmd',
    dateBtn: ['D', 'M'],
    defaultDate: 'D',
    defaultSelectBtn: 'D',
    getChartOption: getPdmdChart,
    cardData: [],
    tableData: {
      configData: [
        { title: '时间', col: 12, key: 'time' },
        { title: '用电需量(kW)', col: 12, key: 'Pdmd' }
      ],
      columnsNum: 4
    }
  },
  {
    btnName: '有功功率',
    getAction: loadPData,
    aggrLevel: 'measurement',
    pointCategory: 'P',
    name: 'P',
    socket: { getCardData: () => {} },
    getChartOption: (chartData, timeData) =>
      getLineBoxplotChart({
        chartData,
        timeData,
        name: 'P',
        unit: 'kW',
        color: palette.P
      }),
    dateBtn: ['H', 'D', 'M'],
    defaultDate: 'H',
    defaultSelectBtn: 'H',
    cardData: [
      {
        cardName: '最大有功功率',
        key: 'maxP',
        unit: 'kW'
      },
      {
        cardName: '最小有功功率',
        key: 'minP',
        unit: 'kW'
      },
      {
        cardName: '平均有功功率',
        key: 'Pavg',
        unit: 'kW'
      },
      {
        cardName: '峰谷差',
        key: 'fengGuReduce',
        unit: 'kW'
      },
      {
        cardName: '峰谷差率',
        key: 'fengGuReta',
        unit: '%'
      }
    ],
    tableData: {
      configData: [
        { title: '时间', col: 12, key: 'time' },
        { title: '有功功率(kW)', col: 12, key: 'P' }
      ],
      columnsNum: 4
    }
  },
  {
    btnName: '功率因数',
    getAction: loadCOSQData,
    aggrLevel: 'measurement',
    pointCategory: 'P',
    name: 'COSQ',
    getChartOption: getCOSQChart,
    dateBtn: ['D', 'M'],
    defaultDate: 'D',
    defaultSelectBtn: 'D',
    tableData: [],
    cardData: [
      {
        cardName: '最大功率因数',
        key: 'COSQmax',
        unit: 'kWA'
      },
      {
        cardName: '最低功率因数',
        key: 'COSQmin',
        unit: 'kWA'
      },
      {
        cardName: '平均功率因数',
        key: 'COSQavg',
        unit: 'kWA'
      },
      {
        cardName: '电费系数',
        key: 'electricityCoe',
        unit: 'kWA'
      }
    ]
  }
];
const circuitBtns = [
  {
    btnName: '电量',
    aggrLevel: 'circuit',
    pointCategory: 'EP',
    name: 'EP',
    getAction: loadEpData,
    getChartOption: getEPChart,
    dateBtn: ['H', 'D', 'M'],
    defaultDate: 'H',
    defaultSelectBtn: 'H',
    cardData: [
      {
        cardName: '总电量',
        key: 'totalEP',
        unit: 'kWA'
      },
      {
        cardName: '尖电量',
        key: 'EP1',
        unit: 'kWA'
      },
      {
        cardName: '峰电量',
        key: 'EP2',
        unit: 'kWA'
      },
      {
        cardName: '平电量',
        key: 'EP3',
        unit: 'kWA'
      },
      {
        cardName: '谷电量',
        key: 'EP4',
        unit: 'kWA'
      }
    ],
    tableData: {
      configData: [
        { title: '时间', col: 12, key: 'time' },
        { title: '总电量(kWh)', col: 12, key: 'EP' }
      ],
      columnsNum: 4
    }
  },
  {
    btnName: '需量',
    getAction: loadHistoryData,
    aggrLevel: 'circuit',
    pointCategory: 'P',
    name: 'Pdmd',
    dateBtn: ['D', 'M'],
    defaultDate: 'D',
    defaultSelectBtn: 'D',
    getChartOption: getPdmdChart,
    cardData: [],
    tableData: {
      configData: [
        { title: '时间', col: 12, key: 'time' },
        { title: '用电需量(kW)', col: 12, key: 'Pdmd' }
      ],
      columnsNum: 4
    }
  },
  {
    btnName: '有功功率',
    getAction: loadPData,
    aggrLevel: 'circuit',
    pointCategory: 'P',
    name: 'P',
    socket: { getCardData: () => {} },
    getChartOption: (chartData, timeData) =>
      getLineBoxplotChart({
        chartData,
        timeData,
        name: 'P',
        unit: 'kW',
        color: palette.P
      }),
    dateBtn: ['H', 'D', 'M'],
    defaultDate: 'H',
    defaultSelectBtn: 'H',
    cardData: [
      {
        cardName: '最大有功功率',
        key: 'maxP',
        unit: 'kWA'
      },
      {
        cardName: '最小有功功率',
        key: 'minP',
        unit: 'kWA'
      },
      {
        cardName: '平均有功功率',
        key: 'Pdmd',
        unit: 'kWA'
      },
      {
        cardName: '峰谷差',
        key: 'fengGuReduce',
        unit: 'kWA'
      },
      {
        cardName: '峰谷差率',
        key: 'fengGuReta',
        unit: '%'
      }
    ],
    tableData: {
      configData: [
        { title: '时间', col: 12, key: 'time' },
        { title: '有功功率(kW)', col: 12, key: 'P' }
      ],
      columnsNum: 4
    }
  },
  {
    btnName: '相电压',
    getAction: loadHistoryData,
    aggrLevel: 'circuit',
    pointCategory: 'U',
    name: 'Ua,Ub,Uc',
    socket: { getCardData: () => {} },
    getChartOption: (chartData, timeData) =>
      getLineBoxplotChart({
        chartData,
        timeData,
        name: ['Ua', 'Ub', 'Uc'],
        unit: 'V',
        color: palette.U
      }),
    dateBtn: ['H', 'D', 'M'],
    defaultDate: 'H',
    defaultSelectBtn: 'H',
    cardData: [
      {
        cardName: 'A相最高电压',
        key: 'maxUa',
        unit: 'V'
      },
      {
        cardName: 'A相最低电压',
        key: 'minUa',
        unit: 'V'
      },
      {
        cardName: 'B相最高电压',
        key: 'maxUb',
        unit: 'V'
      },
      {
        cardName: 'B相最低电压',
        key: 'minUb',
        unit: 'V'
      },
      {
        cardName: 'C相最高电压',
        key: 'maxUc',
        unit: 'V'
      },
      {
        cardName: 'C相最低电压',
        key: 'minUc',
        unit: 'V'
      }
    ],
    tableData: {
      configData: [
        { title: '时间', col: 6, key: 'time' },
        { title: 'A相电压(V)', col: 6, key: 'Ua' },
        { title: 'B相电压(V)', col: 6, key: 'Ub' },
        { title: 'C相电压(V)', col: 6, key: 'Uc' }
      ],
      columnsNum: 2
    }
  },
  {
    btnName: '线电压',
    getAction: loadHistoryData,
    aggrLevel: 'circuit',
    pointCategory: 'U',
    name: 'Uab,Ubc,Uca',
    socket: { getCardData: () => {} },
    getChartOption: (chartData, timeData) =>
      getLineBoxplotChart({
        chartData,
        timeData,
        name: ['Uab', 'Ubc', 'Uca'],
        unit: 'V',
        color: palette.U
      }),
    dateBtn: ['H', 'D', 'M'],
    defaultDate: 'H',
    defaultSelectBtn: 'H',
    cardData: [
      {
        cardName: 'AB线最高电压',
        key: 'maxUab',
        unit: 'V'
      },
      {
        cardName: 'AB线最低电压',
        key: 'minUab',
        unit: 'V'
      },
      {
        cardName: 'BC线最高电压',
        key: 'maxUbc',
        unit: 'V'
      },
      {
        cardName: 'BC线最低电压',
        key: 'minUbc',
        unit: 'V'
      },
      {
        cardName: 'CA线最高电压',
        key: 'maxUca',
        unit: 'V'
      },
      {
        cardName: 'CA线最低电压',
        key: 'minUca',
        unit: 'V'
      }
    ],
    tableData: {
      configData: [
        { title: '时间', col: 6, key: 'time' },
        { title: 'AB线电压(V)', col: 6, key: 'Uab' },
        { title: 'BC线电压(V)', col: 6, key: 'Ubc' },
        { title: 'CA线电压(V)', col: 6, key: 'Uca' }
      ],
      columnsNum: 2
    }
  },
  {
    btnName: '电流',
    aggrLevel: 'circuit',
    pointCategory: 'I',
    getAction: loadHistoryData,
    name: 'Ia,Ib,Ic',
    socket: { getCardData: () => {} },
    getChartOption: (chartData, timeData) =>
      getLineBoxplotChart({
        chartData,
        timeData,
        name: ['Ia', 'Ib', 'Ic'],
        unit: 'A',
        color: palette.I
      }),
    dateBtn: ['H', 'D', 'M'],
    defaultDate: 'H',
    defaultSelectBtn: 'H',
    cardData: [
      {
        cardName: 'A相最高电流',
        key: 'maxIa',
        unit: 'A'
      },
      {
        cardName: 'A相最低电流',
        key: 'minIa',
        unit: 'A'
      },
      {
        cardName: 'B相最高电流',
        key: 'maxIb',
        unit: 'A'
      },
      {
        cardName: 'B相最低电流',
        key: 'minIb',
        unit: 'A'
      },
      {
        cardName: 'C相最高电流',
        key: 'maxIc',
        unit: 'A'
      },
      {
        cardName: 'C相最低电流',
        key: 'minIc',
        unit: 'A'
      }
    ],
    tableData: {
      configData: [
        { title: '时间', col: 6, key: 'time' },
        { title: 'A相电流(A)', col: 6, key: 'Ia' },
        { title: 'B相电流(A)', col: 6, key: 'Ib' },
        { title: 'C相电流(A)', col: 6, key: 'Ic' }
      ],
      columnsNum: 2
    }
  },
  {
    btnName: '功率因数',
    getAction: loadCOSQData,
    aggrLevel: 'circuit',
    pointCategory: 'P',
    name: 'COSQ',
    getChartOption: getCOSQChart,
    dateBtn: ['D', 'M'],
    defaultDate: 'D',
    defaultSelectBtn: 'D',
    tableData: [],
    cardData: [
      {
        cardName: '最高功率因数',
        key: 'COSQmax',
        unit: 'kWA'
      },
      {
        cardName: '最低功率因数',
        key: 'COSQmin',
        unit: 'kWA'
      },
      {
        cardName: '平均功率因数',
        key: 'COSQavg',
        unit: 'kWA'
      },
      {
        cardName: '电费系数',
        key: 'electricityCoe',
        unit: 'kWA'
      }
    ]
  },
  {
    btnName: '温度',
    aggrLevel: 'circuit',
    getAction: loadHistoryData,
    pointCategory: 'T',
    name: 'T-Ina,T-Inb,T-Inc',
    socket: { getCardData: () => {} },
    getChartOption: (chartData, timeData) =>
      getLineBoxplotChart({
        chartData,
        timeData,
        name: ['T-Ina', 'T-Inb', 'T-Inc'],
        unit: 'V',
        color: palette.T
      }),
    dateBtn: ['H', 'D', 'M'],
    defaultDate: 'H',
    defaultSelectBtn: 'H',
    cardData: [
      {
        cardName: 'A相最高温度',
        key: 'maxTIna',
        unit: '℃'
      },
      {
        cardName: 'A相最低温度',
        key: 'minTIna',
        unit: '℃'
      },
      {
        cardName: 'B相最高温度',
        key: 'maxTInb',
        unit: '℃'
      },
      {
        cardName: 'B相最低温度',
        key: 'minTInb',
        unit: '℃'
      },
      {
        cardName: 'C相最高温度',
        key: 'maxTInc',
        unit: '℃'
      },
      {
        cardName: 'C相最低温度',
        key: 'minTInc',
        unit: '℃'
      }
    ],
    tableData: {
      configData: [
        { title: '时间', col: 6, key: 'time' },
        { title: 'A相温度(℃)', col: 6, key: 'T-Ina' },
        { title: 'B相温度(℃)', col: 6, key: 'T-Inb' },
        { title: 'C相温度(℃)', col: 6, key: 'T-Inc' }
      ],
      columnsNum: 2
    }
  },
  {
    btnName: '三相电压不平衡度',
    getAction: loadHistoryData,
    aggrLevel: 'circuit',
    pointCategory: 'U',
    name: 'Uunb',
    socket: { getCardData: () => {} },
    getChartOption: (chartData, timeData) =>
      getLineBoxplotChart({
        chartData,
        timeData,
        name: 'Uunb',
        unit: '%',
        color: palette.Uunb
      }),
    dateBtn: ['H', 'D', 'M'],
    defaultDate: 'H',
    defaultSelectBtn: 'H',
    tableData: {
      configData: [
        { title: '时间', col: 12, key: 'time' },
        { title: '不平衡度(%)', col: 12, key: 'Uunb' }
      ],
      columnsNum: 4
    },
    cardData: []
  },
  {
    btnName: '三相电流不平衡度',
    aggrLevel: 'circuit',
    getAction: loadHistoryData,
    pointCategory: 'I',
    name: 'Iunb',
    socket: { getCardData: () => {} },
    getChartOption: (chartData, timeData) =>
      getLineBoxplotChart({
        chartData,
        timeData,
        name: 'Iunb',
        unit: '%',
        color: palette.Iunb
      }),
    dateBtn: ['H', 'D', 'M'],
    defaultDate: 'H',
    defaultSelectBtn: 'H',
    tableData: {
      configData: [
        { title: '时间', col: 12, key: 'time' },
        { title: '不平衡度(%)', col: 12, key: 'Iunb' }
      ],
      columnsNum: 4
    },
    cardData: []
  },
  {
    btnName: '频率',
    getAction: loadHistoryData,
    aggrLevel: 'circuit',
    pointCategory: 'f',
    name: 'f',
    socket: { getCardData: () => {} },
    getChartOption: (chartData, timeData) =>
      getLineBoxplotChart({
        chartData,
        timeData,
        name: 'f',
        unit: 'Hz',
        color: palette.f
      }),
    dateBtn: ['H', 'D', 'M'],
    defaultDate: 'H',
    defaultSelectBtn: 'H',
    tableData: {
      configData: [
        { title: '时间', col: 12, key: 'time' },
        { title: '频率(Hz)', col: 12, key: 'f' }
      ],
      columnsNum: 4
    },
    cardData: []
  },
  {
    btnName: '电压总谐波',
    getAction: loadHistoryData,
    aggrLevel: 'circuit',
    pointCategory: 'THD',
    name: 'UaTHD,UbTHD,UcTHD',
    getChartOption: (chartData, timeData) =>
      getLineBoxplotChart({
        chartData,
        timeData,
        name: ['UaTHD', 'UbTHD', 'UcTHD'],
        unit: '%',
        color: palette.U
      }),
    dateBtn: ['H'],
    defaultDate: 'H',
    defaultSelectBtn: 'H',
    cardData: [
      {
        cardName: '最高A相电压谐波',
        key: 'maxUaTHD',
        unit: '%'
      },
      {
        cardName: '最低A相电压谐波',
        key: 'minUaTHD',
        unit: '%'
      },
      {
        cardName: '最高B相电压谐波',
        key: 'maxUbTHD',
        unit: '%'
      },
      {
        cardName: '最低B相电压谐波',
        key: 'minUbTHD',
        unit: '%'
      },
      {
        cardName: '最高C相电压谐波',
        key: 'maxUcTHD',
        unit: '%'
      },
      {
        cardName: '最低C相电压谐波',
        key: 'minUcTHD',
        unit: '%'
      }
    ],
    tableData: {
      configData: [
        { title: '时间', col: 6, key: 'time' },
        { title: 'A相电压总谐波(%)', col: 6, key: 'UaTHD' },
        { title: 'B相电压总谐波(%)', col: 6, key: 'UbTHD' },
        { title: 'C相电压总谐波(%)', col: 6, key: 'UcTHD' }
      ],
      columnsNum: 2
    }
  },
  {
    btnName: '电流总谐波',
    getAction: loadHistoryData,
    aggrLevel: 'circuit',
    pointCategory: 'THD',
    name: 'IaTHD,IbTHD,IcTHD',
    getChartOption: (chartData, timeData) =>
      getLineBoxplotChart({
        chartData,
        timeData,
        name: ['IaTHD', 'IbTHD', 'IcTHD'],
        unit: '%',
        color: palette.U
      }),
    dateBtn: ['H'],
    defaultDate: 'H',
    defaultSelectBtn: 'H',
    cardData: [
      {
        cardName: '最高A相电流谐波',
        key: 'maxIaTHD',
        unit: '%'
      },
      {
        cardName: '最低A相电流谐波',
        key: 'minIaTHD',
        unit: '%'
      },
      {
        cardName: '最高B相电流谐波',
        key: 'maxIbTHD',
        unit: '%'
      },
      {
        cardName: '最低B相电流谐波',
        key: 'minIbTHD',
        unit: '%'
      },
      {
        cardName: '最高C相电流谐波',
        key: 'maxIcTHD',
        unit: '%'
      },
      {
        cardName: '最低C相电流谐波',
        key: 'minIcTHD',
        unit: '%'
      }
    ],
    tableData: {
      configData: [
        { title: '时间', col: 6, key: 'time' },
        { title: 'A相电流总谐波(%)', col: 6, key: 'IaTHD' },
        { title: 'B相电流总谐波(%)', col: 6, key: 'IbTHD' },
        { title: 'C相电流总谐波(%)', col: 6, key: 'IcTHD' }
      ],
      columnsNum: 2
    }
  },
  {
    btnName: '无功功率',
    getAction: loadHistoryData,
    aggrLevel: 'circuit',
    pointCategory: 'Q',
    name: 'Q',
    getChartOption: getCOSQChart,
    dateBtn: ['H'],
    defaultDate: 'H',
    defaultSelectBtn: 'H',
    tableData: {
      configData: [
        { title: '时间', col: 6, key: 'time' },
        { title: '无功功率(kVar)', col: 6, key: 'Q' }
      ],
      columnsNum: 4
    },
    cardData: []
  },
  {
    btnName: '视在功率',
    getAction: loadHistoryData,
    aggrLevel: 'circuit',
    pointCategory: 'S',
    name: 'S',
    getChartOption: getCOSQChart,
    dateBtn: ['H'],
    defaultDate: 'H',
    defaultSelectBtn: 'H',
    tableData: {
      configData: [
        { title: '时间', col: 6, key: 'time' },
        { title: '视在功率(kVA)', col: 6, key: 'S' }
      ],
      columnsNum: 4
    },
    cardData: []
  }
];

export const tabs = {
  measurementBtns,
  circuitBtns
};
