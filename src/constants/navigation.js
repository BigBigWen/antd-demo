import {
  OVERVIEW_READ,
  DIAGRAM_READ,
  DC_READ,
  ENVIRONMENTAL_READ,
  ALARM_READ,
  MANUAL_ALARM_READ,
  REPORT_READ,
  ASSET_READ,
  ENERGY_EFFICIENCY_READ,
  STATISTICAL_REPORT_READ,
  EP_ANALYSIS_READ,
  LOSS_READ,
  POWER_ANALYSIS_READ,
  HISTORY_READ,
  PROJECT_READ,
  REPORTED_INSTALLATION_READ,
  PERMISSION_READ,
  USER_READ,
  INSPECTION_PLAN_READ,
  LOSS_WRITE,
  ROTA_READ,
  TICKET_STAT_READ
} from 'constants/authority';

// to为`xxx/${key}`的格式
const NAV_AUTH = [
  {
    name: '总览',
    key: 'overview',
    auth: OVERVIEW_READ,
    to: '/overview'
  },
  {
    name: '资产管理',
    son: [
      {
        name: '运行概览',
        auth: DIAGRAM_READ,
        key: 'diagram',
        to: '/assets/diagram'
      },
      { name: '直流系统', auth: 'DC_READ', key: 'dc', to: '/page1' },
      {
        name: '环境监测',
        auth: ENVIRONMENTAL_READ,
        key: 'environmental',
        to: '/assets/environmental'
      },
      {
        name: '异常报警',
        auth: ALARM_READ,
        key: 'alarm',
        to: '/assets/alarm'
      },
      {
        name: '安全隐患',
        auth: MANUAL_ALARM_READ,
        key: 'manual-alarm',
        to: '/assets/manual-alarm'
      },
      {
        name: '管理报告',
        auth: REPORT_READ,
        key: 'report',
        to: '/assets/report'
      },
      {
        name: '资产档案',
        auth: ASSET_READ,
        key: 'asset',
        to: '/assets/asset'
      }
    ]
  },
  {
    name: '能效管理',
    to: '/page1',
    son: [
      {
        name: '能效概览',
        auth: ENERGY_EFFICIENCY_READ,
        key: 'energy-overview',
        to: '/energy/energy-overview'
      },
      {
        name: '电量统计',
        auth: EP_ANALYSIS_READ,
        key: 'ep-statistics',
        to: '/energy/ep-statistics'
      },
      {
        name: '用电分析',
        auth: POWER_ANALYSIS_READ,
        key: 'energy-analysis',
        to: '/energy/energy-analysis'
      },
      {
        name: '损耗概览',
        auth: LOSS_READ,
        key: 'loss-overview',
        to: '/energy/loss-overview'
      },
      {
        name: '统计报表',
        auth: STATISTICAL_REPORT_READ,
        key: 'statistical-report',
        to: '/energy/statistical-report'
      }
    ]
  },
  {
    name: '历史数据',
    to: '/page1',
    son: [
      {
        name: '用电数据',
        auth: HISTORY_READ,
        key: 'history-data',
        to: '/history/history-data'
      },
      {
        name: '损耗数据',
        auth: LOSS_READ,
        key: 'loss-history',
        to: '/history/loss-history'
      }
    ]
  },
  {
    name: '配置管理',
    to: '/page1',
    son: [
      {
        name: '项目管理',
        auth: 'PROJECT_READ',
        key: 'project-list',
        to: '/config/project-list'
      },
      {
        name: '权限管理',
        auth: PERMISSION_READ,
        key: 'permission',
        to: '/conf/permission'
      },
      { name: '人员管理', auth: USER_READ, key: 'user', to: '/config/user' },
      {
        name: '电费报装',
        auth: REPORTED_INSTALLATION_READ,
        key: 'report-installation',
        to: '/config/report-installation'
      },
      {
        name: '巡检计划',
        auth: INSPECTION_PLAN_READ,
        key: 'inspection-plan',
        to: '/config/inspection-plan'
      },
      { name: '值班管理', auth: ROTA_READ, key: 'rota', to: '/config/rota' },
      {
        name: '工单统计',
        auth: TICKET_STAT_READ,
        key: 'ticket-statistics',
        to: '/config/ticket-statistics'
      }
    ]
  },
  {
    name: '帮助与反馈',
    to: '/page1',
    son: [
      { name: '关于系统', key: 'SYSTEM', to: '/nav-test' },
      { name: '使用说明', key: 'GUIDE', to: '/page1' },
      { name: '常见问题', key: 'QUESTION', to: '/page1' },
      { name: '建议反馈', key: 'FEEDBACK', to: '/page1' }
    ]
  }
];

export const navFormatter = (auth = []) => {
  const outerFilter = item => {
    if (item.auth && auth.includes(item.auth)) {
      return true;
    } else if (
      item.son &&
      item.son.some(p => auth.includes(p.auth) || !p.auth)
    ) {
      return true;
    }
    return false;
  };

  const innerFilter = item => {
    if (!item.auth) {
      return true;
    } else if (item.auth && auth.includes(item.auth)) {
      return true;
    }
    return false;
  };

  return NAV_AUTH.filter(outerFilter).map(p => ({
    ...p,
    son: p.son ? p.son.filter(innerFilter) : []
  }));
};
