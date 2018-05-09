module.exports = {
  repairTicketTitle: [
    {
      title: '生成时间',
      dataIndex: 'time',
      width: 150
    },
    {
      title: '项目',
      dataIndex: 'project',
      width: 110
    },
    {
      title: '工单内容',
      dataIndex: 'content',
      width: 110
    },
    {
      title: '工单状态',
      dataIndex: 'status',
      width: 100
    }
  ],
  inspectionTicketTitle: [
    {
      title: '巡检工单名称',
      dataIndex: 'name',
      width: 110
    },
    {
      title: '项目',
      dataIndex: 'project',
      width: 110
    },
    {
      title: '巡检日期',
      dataIndex: 'date',
      width: 150
    },
    {
      title: '工单状态',
      dataIndex: 'status',
      width: 100
    }
  ],
  inspectionPlanTitle: [
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
  ],
  ticketCountTitle: [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 161
    },
    {
      title: '抢修工单',
      dataIndex: 'urgent-sheet',
      key: 'urgent-sheet',
      width: 518,
      children: [
        {
          title: '总数(个)',
          dataIndex: 'total',
          key: 'total',
          width: 176
        },
        {
          title: '完成数(个)',
          dataIndex: 'completed',
          key: 'completed',
          width: 176
        },
        {
          title: '未完成数(个)',
          dataIndex: 'uncompleted',
          key: 'uncompleted',
          width: 180
        }
      ]
    },
    {
      title: '巡检工单',
      dataIndex: 'inspection',
      key: 'inspection',
      children: [
        {
          title: '总数(个)',
          dataIndex: 'insTotal',
          key: 'insTotal',
          width: 176
        },
        {
          title: '完成数(个)',
          dataIndex: 'insCompleted',
          key: 'insCompleted',
          width: 173
        },
        {
          title: '未完成数(个)',
          dataIndex: 'insUncompleted',
          key: 'insUncompleted',
          width: 176
        }
      ]
    }
  ],
  ticketHourTitle: [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 160
    },
    {
      title: '抢修工单',
      dataIndex: 'urgent_sheet',
      key: 'urgent_sheet',
      width: 575,
      children: [
        {
          title: '平均时长(分钟)',
          dataIndex: 'average',
          key: 'average',
          width: 116
        },
        {
          title: '待确定(分钟)',
          dataIndex: 'toConfirm',
          key: 'toConfirm',
          width: 116
        },
        {
          title: '分配中(分钟)',
          dataIndex: 'toAssign',
          key: 'toAssign',
          width: 115
        },
        {
          title: '执行中(分钟)',
          dataIndex: 'inAction',
          key: 'inAction',
          width: 117
        },
        {
          title: '完成(分钟)',
          dataIndex: 'finished',
          key: 'finished',
          width: 116
        }
      ]
    },
    {
      title: '巡检工单',
      dataIndex: 'inspection',
      key: 'inspection',
      width: 464,
      children: [
        {
          title: '平均时长(分钟)',
          dataIndex: 'insAverage',
          key: 'insAverage',
          width: 116
        },
        {
          title: '分配中(分钟)',
          dataIndex: 'instoAssign',
          key: 'instoAssign',
          width: 116
        },
        {
          title: '执行中(分钟)',
          dataIndex: 'insinAction',
          key: 'insinAction',
          width: 116
        }
        // {
        //   title: '完成(分钟)',
        //   dataIndex: 'insFinished',
        //   key: 'insFinished',
        //   width: 116
        // }
      ]
    }
  ]
};
