export const ticketCountTitle = [
  {
    title: '姓名',
    dataIndex: 'worker.name',
    key: 'name',
    width: 150
  },
  {
    title: '抢修工单',
    key: 'repair-ticket',
    children: [
      {
        title: '总数(个)',
        dataIndex: 'repairAll',
        key: 'repairAll',
        width: 150
      },
      {
        title: '完成数(个)',
        dataIndex: 'repairFinished',
        key: 'repairFinished',
        width: 150
      },
      {
        title: '未完成数(个)',
        dataIndex: 'repairUnfinished',
        key: 'repairUnfinished',
        width: 150
      }
    ]
  },
  {
    title: '巡检工单',
    key: 'inspection-ticket',
    children: [
      {
        title: '总数(个)',
        dataIndex: 'inspectionAll',
        key: 'inspectionAll',
        width: 150
      },
      {
        title: '完成数(个)',
        dataIndex: 'inspectionFinished',
        key: 'inspectionFinished',
        width: 150
      },
      {
        title: '未完成数(个)',
        dataIndex: 'inspectionUnfinished',
        key: 'inspectionUnfinished',
        width: 150
      }
    ]
  }
];

export const ticketHourTitle = [
  {
    title: '姓名',
    dataIndex: 'worker.name',
    key: 'name',
    width: 160
  },
  {
    title: '抢修工单',
    key: 'repair-ticket',
    children: [
      {
        title: '平均时长(分钟)',
        dataIndex: 'repairAvg',
        key: 'repairAvg',
        width: 116
      },
      {
        title: '待确定(分钟)',
        dataIndex: 'repairWaiting',
        key: 'repairWaiting',
        width: 116
      },
      {
        title: '分配中(分钟)',
        dataIndex: 'repairAssigning',
        key: 'repairAssigning',
        width: 115
      },
      {
        title: '执行中(分钟)',
        dataIndex: 'repairExecuting',
        key: 'repairExecuting',
        width: 117
      },
      {
        title: '完成(分钟)',
        dataIndex: 'repairFinished',
        key: 'repairFinished',
        width: 116
      }
    ]
  },
  {
    title: '巡检工单',
    key: 'inspection-ticket',
    children: [
      {
        title: '平均时长(分钟)',
        dataIndex: 'inspectionAvg',
        key: 'inspectionAvg',
        width: 116
      },
      {
        title: '分配中(分钟)',
        dataIndex: 'inspectionAssigning',
        key: 'inspectionAssigning',
        width: 116
      },
      {
        title: '执行中(分钟)',
        dataIndex: 'inspectionExecuting',
        key: 'inspectionExecuting',
        width: 116
      }
      // {
      //   title: '完成(分钟)',
      //   dataIndex: 'inspectionFinished',
      //   key: 'inspectionFinished',
      //   width: 116
      // }
    ]
  }
];
