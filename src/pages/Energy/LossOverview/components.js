import React from 'react';
import { Icon, Tooltip, Button } from 'antd';
import { Chart } from 'components/Chart';
import { numLabel } from 'lib/helper';
const ButtonGroup = Button.Group;

export const TotalAmountCard = ({ economicLoss }) => (
  <div className="card-footer">
    <span className="footer-name">经济损失</span>
    <span>{`¥ ${numLabel(economicLoss, 0)}`}</span>
  </div>
);

export const TotalRateCard = ({ monthOverMonth }) => (
  <div className="card-footer">
    <span className="footer-name">
      环比{monthOverMonth >= 0 ? '增加 ' : monthOverMonth < 0 ? '减少 ' : ' '}
      {numLabel(monthOverMonth)}%
    </span>
    <span
      className={
        monthOverMonth >= 0 ? 'top' : monthOverMonth < 0 ? 'bottom' : ''
      }
    />
  </div>
);

export class Card extends React.Component {
  render() {
    const { title, Footer, option, style = {} } = this.props;
    return (
      <div className="c-lossRead-card" style={style}>
        <div className="card-title">{title.name}</div>
        <div className="value-container">
          <span className="value">{numLabel(title.value, title.fix)}</span>
          <span className="unit">{title.unit}</span>
        </div>
        <div className="card-content">
          <Chart option={option} />
        </div>
        <div className="card-footer-container">{Footer}</div>
      </div>
    );
  }
}

export class Rank extends React.Component {
  render() {
    const { option, titles } = this.props;
    return (
      <div className="c-lossRead-rank">
        <div className="chart-title">
          {titles.map(i => <span key={i}>{i}</span>)}
        </div>
        <div className="chart-container">
          <Chart option={option} style={{ width: 'calc(100% - 24px)' }} />
        </div>
      </div>
    );
  }
}
