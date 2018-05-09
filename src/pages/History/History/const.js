export const measurementBtns = [
  {
    btnName: '电量',
    aggrLevel: 'measurement',
    pointCategory: 'EP',
    name: 'EP',
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
    aggrLevel: 'measurement',
    pointCategory: 'P',
    name: 'Pdmd',
    dateBtn: ['D', 'M'],
    defaultDate: 'D',
    defaultSelectBtn: 'D',
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
    btnName: '功率',
    aggrLevel: 'measurement',
    pointCategory: 'P',
    name: 'P',
    dateBtn: ['H', 'D', 'M'],
    defaultDate: 'H',
    defaultSelectBtn: 'H',
    cardData: [
      {
        cardName: '最大功率',
        key: 'maxP',
        unit: 'kW'
      },
      {
        cardName: '最小功率',
        key: 'minP',
        unit: 'kW'
      },
      {
        cardName: '平均功率',
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
        { title: '功率(kW)', col: 12, key: 'P' }
      ],
      columnsNum: 4
    }
  },
  {
    btnName: '功率因数',
    aggrLevel: 'measurement',
    pointCategory: 'P',
    name: 'COSQ',
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
  }
];
export const circuitBtns = [
  {
    btnName: '电量',
    aggrLevel: 'circuit',
    pointCategory: 'EP',
    name: 'EP',
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
    aggrLevel: 'measurement',
    pointCategory: 'P',
    name: 'Pdmd',
    dateBtn: ['D', 'M'],
    defaultDate: 'D',
    defaultSelectBtn: 'D',
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
    btnName: '功率',
    aggrLevel: 'circuit',
    pointCategory: 'P',
    name: 'P',
    dateBtn: ['H', 'D', 'M'],
    defaultDate: 'H',
    defaultSelectBtn: 'H',
    cardData: [
      {
        cardName: '最大功率',
        key: 'maxP',
        unit: 'kWA'
      },
      {
        cardName: '最小功率',
        key: 'minP',
        unit: 'kWA'
      },
      {
        cardName: '平均功率',
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
        { title: '功率(kW)', col: 12, key: 'P' }
      ],
      columnsNum: 4
    }
  },
  {
    btnName: '相电压',
    aggrLevel: 'circuit',
    pointCategory: 'U',
    name: 'Ua,Ub,Uc',
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
    aggrLevel: 'circuit',
    pointCategory: 'U',
    name: 'Uab,Ubc,Uca',
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
    name: 'Ia,Ib,Ic',
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
    aggrLevel: 'circuit',
    pointCategory: 'P',
    name: 'COSQ',
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
    pointCategory: 'T',
    name: 'T-Ina,T-Inb,T-Inc',
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
    aggrLevel: 'circuit',
    pointCategory: 'U',
    name: 'Uunb',
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
    pointCategory: 'I',
    name: 'Iunb',
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
    aggrLevel: 'circuit',
    pointCategory: 'f',
    name: 'f',
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
    aggrLevel: 'circuit',
    pointCategory: 'THD',
    name: 'UaTHD,UbTHD,UcTHD',
    dateBtn: ['H'],
    defaultDate: 'H',
    defaultSelectBtn: 'H',
    cardData: [
      {
        cardName: 'A相电压最高谐波',
        key: 'maxUaTHD',
        unit: '%'
      },
      {
        cardName: 'A相电压最低谐波',
        key: 'minUaTHD',
        unit: '%'
      },
      {
        cardName: 'B相电压最高谐波',
        key: 'maxUbTHD',
        unit: '%'
      },
      {
        cardName: 'B相电压最低谐波',
        key: 'minUbTHD',
        unit: '%'
      },
      {
        cardName: 'C相电压最高谐波',
        key: 'maxUcTHD',
        unit: '%'
      },
      {
        cardName: 'C相电压最低谐波',
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
    aggrLevel: 'circuit',
    pointCategory: 'THD',
    name: 'IaTHD,IbTHD,IcTHD',
    dateBtn: ['H'],
    defaultDate: 'H',
    defaultSelectBtn: 'H',
    cardData: [
      {
        cardName: 'A相电流最高谐波',
        key: 'maxIaTHD',
        unit: '%'
      },
      {
        cardName: 'A相电流最低谐波',
        key: 'minIaTHD',
        unit: '%'
      },
      {
        cardName: 'B相电流最高谐波',
        key: 'maxIbTHD',
        unit: '%'
      },
      {
        cardName: 'B相电流最低谐波',
        key: 'minIbTHD',
        unit: '%'
      },
      {
        cardName: 'C相电流最高谐波',
        key: 'maxIcTHD',
        unit: '%'
      },
      {
        cardName: 'C相电流最低谐波',
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
    aggrLevel: 'circuit',
    pointCategory: 'Q',
    name: 'Q',
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
    aggrLevel: 'circuit',
    pointCategory: 'S',
    name: 'S',
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
