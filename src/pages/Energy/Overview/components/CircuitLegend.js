import React from 'react';
import { compose, percent, largeNum, sum } from 'lib/helper';
import { palette } from 'Chart';

const CircuitLegend = ({ data }) => {
  const total = compose(sum, a => a.map(i => i.value))(data);
  return (
    <div className="legend">
      {data
        .map(i => ({
          ...i,
          percent: percent(i.value, total)
        }))
        .map((i, ind) => (
          <div className="legend-item" key={i.name}>
            <div className="name-icon">
              <div
                className="icon"
                style={{
                  background: `${palette.OverviewPie[ind]}`
                }}
              />
              <div className="name">{i.name}</div>
            </div>
            <div className="percent">{i.percent}</div>
          </div>
        ))}
    </div>
  );
};

export default CircuitLegend;
