import React from 'react';
const RenderStatus = text => (
  <div style={{ color: `${text === '在线' ? '#1dc78d' : '#ff4a4a'}` }}>
    {text === '在线' ? '在线' : '离线'}
  </div>
);
export const alarmTitle = [
  {
    title: '设备',
    dataIndex: 'type',
    key: 'type',
    width: '7%'
  },
  {
    title: '编号/名称',
    dataIndex: 'name',
    key: 'name',
    width: '8%'
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: '12%',
    render: RenderStatus
  },
  {
    title: '所属项目',
    dataIndex: 'project',
    key: 'project',
    width: '12%'
  },
  {
    title: '所属配电房',
    dataIndex: 'site',
    key: 'site',
    width: '12%'
  }
];
export const config = [
  {
    key: 'deviceType',
    type: 'BtnSelect',
    options: [
      { value: { level: 1 }, label: '采集终端' },
      { value: { level: 2 }, label: '表计' }
    ],
    wrapperStyle: {
      marginRight: '10px'
    }
  },
  {
    key: 'status',
    type: 'BtnSelect',
    options: [{ value: 1, label: '在线' }, { value: 2, label: '离线' }],
    wrapperStyle: {
      marginRight: '10px'
    }
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
    key: 'name',
    type: 'Search',
    placeholder: '请输入编号/名称',
    wrapperStyle: {
      marginRight: '23px'
    }
  }
];
