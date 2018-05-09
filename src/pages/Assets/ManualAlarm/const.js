import RenderTime from 'components/UI/RenderTime';

export const PotentialSafetyHazard = [
  {
    title: '隐患名称',
    dataIndex: 'name',
    key: 'name',
    width: '7%'
  },
  {
    title: '隐患类型',
    dataIndex: 'eventType',
    key: 'eventType',
    width: '7%'
  },
  {
    title: '所属项目',
    dataIndex: 'projectName',
    key: 'projectName',
    width: '8%'
  },
  {
    title: '所属配电房',
    dataIndex: 'siteName',
    key: 'siteName',
    width: '9%'
  },
  {
    title: '所属回路',
    dataIndex: 'circuit',
    key: 'circuit',
    width: '10%'
  },
  {
    title: '隐患描述',
    dataIndex: 'description',
    key: 'description',
    width: '6%'
  },
  {
    title: '生成时间',
    dataIndex: 'appearRecordTime',
    key: 'appearRecordTime',
    width: '11%',
    render: RenderTime
  },
  {
    title: '恢复时间',
    dataIndex: 'disappearRecordTime',
    key: 'disappearRecordTime',
    width: '11%',
    render: RenderTime
  }
];

export const SuggestionsAndMeasures = [
  {
    title: '建议名称',
    dataIndex: 'name',
    key: 'name',
    width: '8%'
  },
  {
    title: '建议描述',
    dataIndex: 'eventType',
    key: 'eventType',
    width: '10%'
  },
  {
    title: '所属项目',
    dataIndex: 'projectName',
    key: 'projectName',
    width: '8%'
  },
  {
    title: '所属配电房',
    dataIndex: 'siteName',
    key: 'siteName',
    width: '8%'
  },
  {
    title: '所属回路',
    dataIndex: 'circuit',
    key: 'circuit',
    width: '8%'
  },
  {
    title: '生成时间',
    key: 'appearRecordTime',
    dataIndex: 'appearRecordTime',
    width: '10%',
    render: RenderTime
  }
];
