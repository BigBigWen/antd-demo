import React from 'react';
import Block from './Block';
import { Chart, getOption, getRadar } from 'Chart';
import { average } from 'lib/helper';

const ScoreBlock = ({ scores }) => (
  <Block
    title="综合评分"
    tooltip="综合评分"
    footer={`综合得分 ${average(Object.values(scores).map(i => i * 100), 0)}`}
  >
    <div className="main" style={{ height: '100%' }}>
      <Chart
        option={getOption({
          ...getRadar({
            indicator: ['力调质量', '电力损耗', '需量申报', '用电负载'],
            data: [
              {
                name: '综合评分',
                value: [
                  scores.COSQ || 0,
                  scores.loss || 0,
                  scores.Pdmd || 0,
                  scores.load || 0
                ].map(i => (i * 100).toFixed(2))
              }
            ]
          }),
          grid: {
            left: '55px',
            right: '55px',
            top: '25px',
            bottom: '25px'
          },
          tooltip: {}
        })}
      />
    </div>
  </Block>
);

export default ScoreBlock;
