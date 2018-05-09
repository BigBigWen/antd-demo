import React from 'react';
import { largeNum } from 'lib/helper';
import { Spin } from 'antd';
import './FixData.less';

const Fragemnt = React.Fragment;

export default class AlarmFixStat extends React.Component {
  render() {
    const { data, theme, style, loading } = this.props;
    return (
      <div className={`alarm-fix-stat ${theme}`} style={style}>
        <div className="stat">
          {loading && <Spin />}
          <span className="label">总装机容量</span>
          <span className="value">{largeNum(data.capacity)} kWh</span>
        </div>
        <div className="stat">
          {loading && <Spin />}
          <span className="label">配电房总数</span>
          <span className="value">{largeNum(data.siteCount)} 个</span>
        </div>
        <div className="stat">
          {loading && <Spin />}
          <span className="label">运行天数</span>
          <span className="value">{largeNum(data.runtimeDay)} 天</span>
        </div>
      </div>
    );
  }
}
