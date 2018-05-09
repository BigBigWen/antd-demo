import React from 'react';
import { Tooltip, Progress } from 'antd';
import { numLabel } from 'lib/helper';
import Block from './Block';

const dict = {
  1: {
    label: '按容',
    description: '申报容量',
    unit: 'kW'
  },
  2: {
    label: '按需',
    description: '申报需量',
    unit: 'kVA'
  }
};

const Fragment = React.Fragment;

const PdmdBlock = ({ pdmd, type, value }) => {
  const base = Math.max(pdmd, value);
  const pdmdPercent = pdmd / base * 100 || 0;
  const valuePercent = value / base * 100 || 0;
  const text = `${dict[type].description} ${numLabel(value, 0)}${
    dict[type].unit
  }`;
  return (
    <Block
      title="本月最大需量"
      tooltip="统计本月截至当前打开页面时刻数据"
      footer={
        <Fragment>
          <span>{dict[type].label}</span>
          <span style={{ marginLeft: 25 }}>{text}</span>
        </Fragment>
      }
    >
      <div className="main">
        <div className="value-container">
          <div className="value">{numLabel(pdmd, 0)}</div>
          <div className="unit">kW</div>
        </div>
      </div>
      <div className="sub">
        <Tooltip title={`最大需量 ${pdmd}kW`}>
          <Progress
            className={pdmd > value ? 'bg-red' : 'bg-green'}
            percent={pdmdPercent}
            showInfo={false}
            strokeWidth={16}
          />
        </Tooltip>
        <Tooltip title={text}>
          <Progress
            className="bg-blue"
            percent={valuePercent}
            showInfo={false}
            strokeWidth={16}
          />
        </Tooltip>
      </div>
    </Block>
  );
};

export default PdmdBlock;
