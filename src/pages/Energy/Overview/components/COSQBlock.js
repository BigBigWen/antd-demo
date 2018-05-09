import React from 'react';
import moment from 'moment';
import Block from './Block';
import {
  Chart,
  getOption,
  getLine,
  palette,
  getTooltip,
  dayXAxis,
  singleYAxis
} from 'Chart';
import { billFactor } from 'lib/helper';

const COSQBlock = ({ COSQ, data }) => {
  const factor = billFactor(COSQ);
  return (
    <Block
      title="功率因数"
      tooltip="统计本月截至当前打开页面时刻数据"
      footer={`电费系数 ${factor}`}
    >
      <div className="main">
        <div className="value-container">
          <div className="value">{COSQ}</div>
        </div>
      </div>
      <div className="sub">
        <Chart
          option={getOption({
            xAxis: dayXAxis({
              show: false,
              date: moment()
            }),
            yAxis: singleYAxis({ show: false }),
            grid: {
              show: false,
              left: '0%',
              right: '0%',
              top: 5,
              bottom: '0%'
            },
            tooltip: getTooltip({
              unit: '',
              mode: 'D',
              type: 'category',
              confine: true,
              date: moment()
            }),
            series: data.map(i =>
              getLine({
                name: i.name,
                data: i.data,
                color: palette.COSQ[0],
                areaStyle: {
                  color: palette.COSQ[0],
                  opacity: 0.6
                }
              })
            ),
            color: palette.COSQ
          })}
        />
      </div>
    </Block>
  );
};

export default COSQBlock;
