import React from 'react';
import { Tooltip, Icon } from 'antd';
import { numLabel } from 'lib/helper';
import './CardForData.less';

export default class Card extends React.Component {
  render() {
    const { value, name, unit, style = {}, tooltip } = this.props;
    return (
      <div className="c-lossHistoryRead-card" style={style}>
        <div className="card-title">
          <span>{name}</span>
          <span>
            <Tooltip title={tooltip}>
              <Icon type="exclamation-circle-o" />
            </Tooltip>
          </span>
        </div>
        <div className="value-container">
          <span className="value">{numLabel(value)}</span>
          <span className="unit">{unit}</span>
        </div>
      </div>
    );
  }
}
