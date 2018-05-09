import React from 'react';
import { Icon } from 'antd';
import { mom } from 'lib/helper';
import Block from './Block';

const getIcon = val => {
  const num = parseFloat(val);
  return num === 0 ? null : <Icon type={`caret-${num > 0 ? 'up' : 'down'}`} />;
};
const EPBlock = ({ last, current }) => {
  const monthOnMonth = mom(current, last);
  return (
    <Block
      title="本月累计电量"
      tooltip="统计本月截至打开页面时刻数据"
      footer={`上月同期累计电量 ${last}kWh`}
    >
      <div className="main">
        <div className="value-container">
          <div className="value">{current}</div>
          <div className="unit">kWh</div>
        </div>
      </div>
      <div className="sub" style={{ justifyContent: 'flex-end' }}>
        <div className="sub-info">
          环比&nbsp;&nbsp;{monthOnMonth}%
          {getIcon(monthOnMonth)}
        </div>
      </div>
    </Block>
  );
};

export default EPBlock;
