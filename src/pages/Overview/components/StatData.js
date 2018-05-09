import React from 'react';
import { largeNum } from 'lib/helper';
import Expand from './Expand';
import './StatData.less';

const config = [
  {
    title: '总用电量',
    rankTitle: '本月总用电量前三',
    stat: [
      { key: 'epD', label: '今日用电', unit: 'kWh' },
      { key: 'epM', label: '本月用电', unit: 'kWh' },
      { key: 'epY', label: '当年用电', unit: 'kWh' },
      { key: 'ep', label: '历史总量', unit: 'kWh' }
    ],
    rank: {
      key: 'epRank',
      from: 0,
      to: 3,
      itemKey: 'epM',
      unit: 'kWh'
    }
  },
  {
    title: '实时总功率',
    rankTitle: '实时总功率前三',
    stat: { key: 'p', unit: 'kW' },
    rank: {
      key: 'pRank',
      from: 0,
      to: 3,
      itemKey: 'p',
      unit: 'kW'
    }
  },
  {
    title: '当前未恢复报警总数',
    rankTitle: '当前未恢复报警总量前三',
    stat: { key: 'recordCount', unit: '个' },
    rank: {
      key: 'recordCountRank',
      from: 0,
      to: 3,
      itemKey: 'recordCount',
      unit: '个'
    }
  }
];
export default class StatData extends React.Component {
  render() {
    const { data, theme, loading } = this.props;
    return (
      <div className="stat-data-wrapper">
        {config.map(i => (
          <Expand
            key={i.title}
            loading={loading}
            theme={theme}
            title={i.title}
            rankTitle={i.rankTitle}
            stat={
              Array.isArray(i.stat)
                ? i.stat.map(j => ({
                    ...j,
                    value: largeNum(data[j.key])
                  }))
                : { ...i.stat, value: largeNum(data[i.stat.key]) }
            }
            rank={(data[i.rank.key] || [])
              .slice(i.rank.from, i.rank.to)
              .map(j => ({
                label: j.name,
                value: largeNum(j[i.rank.itemKey]),
                unit: i.rank.unit
              }))}
          />
        ))}
      </div>
    );
  }
}
