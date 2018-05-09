export const LossConfigTitle = [
  {
    title: '对象名称',
    dataIndex: 'name',
    key: 'name',
    width: '15.1%'
  },
  {
    title: '损耗类型',
    dataIndex: 'type',
    key: 'type',
    width: '100px'
  },
  {
    title: '起始监测点',
    dataIndex: 'start',
    key: 'start',
    width: '13.8%'
  },
  {
    title: '终止监测点',
    dataIndex: 'end',
    key: 'end',
    width: '47.7%'
  }
];

export const lossType = [
  { label: '总损耗', value: 'TOTAL_LOSS' },
  { label: '变损', value: 'TRANSFORMER_LOSS' },
  { label: '线损', value: 'CIRCUIT_LOSS' }
];
