import RenderTime from 'components/UI/RenderTime';
import moment from 'moment';

export const alarmTitle = [
  {
    title: '报警级别',
    dataIndex: 'level',
    width: '7%'
  },
  {
    title: '报警类型',
    dataIndex: 'eventType',
    width: '8%'
  },
  {
    title: '报警名称',
    dataIndex: 'name',
    width: '12%'
  },
  {
    title: '所属项目',
    dataIndex: 'project.name',
    width: '12%'
  },
  {
    title: '所属配电房',
    dataIndex: 'siteObj.name',
    width: '12%'
  },
  {
    title: '所属回路',
    dataIndex: 'circuitObj.name',
    width: '12%'
  },
  {
    title: '触发时间',
    dataIndex: 'appearRecordTime',
    width: '12%',
    render: RenderTime
  },
  {
    title: '恢复时间',
    dataIndex: 'disappearRecordTime',
    width: '12%',
    render: RenderTime
  }
];
export const config = [
  {
    key: 'level',
    type: 'BtnSelect',
    options: [
      { value: { level: 1 }, label: '预警' },
      { value: { level: 2 }, label: '报警' },
      { value: { level: 3 }, label: '故障' }
    ],
    wrapperStyle: {
      marginRight: '10px'
    }
  },
  {
    key: 'disappear',
    type: 'BtnSelect',
    options: [
      { value: 1, label: '未确认' },
      { value: 2, label: '已确认' },
      { value: 3, label: '已恢复' }
    ],
    wrapperStyle: {
      marginRight: '10px'
    }
  },
  {
    key: ['from', 'to'],
    type: 'BtnSelect',
    wrapperStyle: {
      marginRight: '10px'
    },
    options: [
      {
        value: {
          from: moment()
            .startOf('day')
            .format('x'),
          to: moment()
            .endOf('day')
            .format('x')
        },
        label: '今日'
      },
      {
        value: {
          from: moment()
            .startOf('week')
            .format('x'),
          to: moment()
            .endOf('week')
            .format('x')
        },
        label: '本周'
      },
      {
        value: {
          from: moment()
            .startOf('month')
            .format('x'),
          to: moment()
            .endOf('month')
            .format('x')
        },
        label: '本月'
      }
    ]
  },
  {
    key: ['project', 'site'],
    type: 'Cascader',
    label: '项目/配电房',
    placeholder: '请选择项目--配电房',
    defaultValue: ['', ''],
    changeOnSelect: true,
    options: [],
    itemStyle: {
      width: 200,
      marginRight: '10px'
    }
  },
  {
    key: 'test01',
    type: 'Select',
    label: '生成工单',
    placeholder: '请选择是否生成',
    options: [{ value: 1, label: '是' }, { value: 2, label: '否' }],
    wrapperStyle: {
      marginRight: '10px'
    }
  },
  {
    key: ['triggerFrom', 'triggerTo'],
    type: 'RangePicker',
    label: '触发时间',
    itemStyle: {
      width: 195,
      marginRight: '10px'
    }
  },
  {
    key: ['disappearFrom', 'disappearTo'],
    type: 'RangePicker',
    label: '恢复时间',
    itemStyle: {
      width: 195,
      marginRight: '10px'
    }
  }
];
