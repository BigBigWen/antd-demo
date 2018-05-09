export const Waiting = 'Waiting';
export const Assigning = 'Assigning';
export const Executing = 'Executing';
export const Finished = 'Finished';
export const Approved = 'Approved';
export const Closed = 'Closed';
export const All = '';
export const all = 'all';

export const confirm = 'confirm';
export const transfer = 'transfer';
export const close = 'close';
export const accept = 'accept';
export const assign = 'assign';
export const finish = 'finish';
export const fail = 'fail';
export const pass = 'pass';
export const supplement = 'supplement';

export const statusDict = {
  [all]: '全部',
  [Waiting]: '待确认',
  [Assigning]: '分配中',
  [Executing]: '执行中',
  [Finished]: '完成',
  [Approved]: '验收通过',
  [Closed]: '关闭'
};
export const insStatusDict = {
  [all]: '全部',
  [Assigning]: '分配中',
  [Executing]: '执行中',
  [Finished]: '完成'
};
export const actionDict = {
  [confirm]: '确认',
  [transfer]: '转给他人',
  [close]: '关闭',
  [accept]: '接受',
  [assign]: '分配',
  [finish]: '完成',
  [fail]: '验收退回',
  [pass]: '验收通过',
  [supplement]: '补充编辑'
};
export const repairStatusSteps = Object.keys(statusDict)
  .slice(1, -1)
  .map(key => ({
    title: statusDict[key],
    key: key
  }));

export const repairClosedSteps = [
  ...Object.keys(statusDict).slice(1, 2),
  Closed
].map(key => ({
  title: statusDict[key],
  key: key
}));
export const inspectStatusSteps = Object.keys(statusDict)
  .slice(2, 5)
  .map(key => ({
    title: statusDict[key],
    key: key
  }));

export const alertTypes = [
  { name: '预警', id: '1' },
  { name: '报警', id: '2' },
  { name: '故障', id: '3' }
];
