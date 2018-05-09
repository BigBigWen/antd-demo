import moment from 'moment';
export const config = [
  {
    key: ['projectId', 'siteId'],
    type: 'Cascader',
    label: '项目/配电房',
    defaultValue: ['', ''],
    changeOnSelect: true,
    options: [],
    wrapperStyle: {
      width: 270,
      marginLeft: 25
    }
  },
  {
    key: ['firstTimeStart', 'firstTimeEnd'],
    type: 'RangePicker',
    label: '首次巡检日期',
    defaultValue: [],
    wrapperStyle: {
      width: 400,
      marginLeft: 25
    },
    itemStyle: {
      width: 185,
      marginLeft: 15
    }
  },
  {
    key: ['validateTimeStart', 'validateTimeEnd'],
    type: 'RangePicker',
    label: '服务有效日期',
    wrapperStyle: {
      width: 400,
      marginLeft: 25
    },
    itemStyle: {
      width: 185,
      marginLeft: 15
    },
    defaultValue: []
  },
  {
    key: 'unit',
    type: 'Select',
    label: '巡检周期',
    defaultValue: null,
    wrapperStyle: {
      marginLeft: 45
    },
    options: [
      { label: '全部', value: null },
      { label: '日', value: 'DAY' },
      { label: '周', value: 'WEEK' },
      { label: '月', value: 'MONTH' }
    ]
  }
];

export const inspectionPlanTitle = [
  {
    title: '巡检计划名称',
    dataIndex: 'name',
    width: 120
  },
  {
    title: '项目',
    dataIndex: 'project',
    width: 120
  },
  {
    title: '首次巡检日期',
    dataIndex: 'firstTime',
    width: 150
  },
  {
    title: '巡检周期',
    dataIndex: 'period',
    width: 100
  },
  {
    title: '巡检进度',
    dataIndex: 'count',
    width: 120
  }
];
