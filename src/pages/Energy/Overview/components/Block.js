import React from 'react';
import { Icon, Tooltip } from 'antd';
import './Block.less';

const Block = ({ title, tooltip = '', children, footer }) => (
  <div className="block">
    <div className="header">
      {title}
      <Tooltip title={tooltip}>
        <Icon type="exclamation-circle-o" />
      </Tooltip>
    </div>
    <div className="content">{children}</div>
    <div className="footer">{footer}</div>
  </div>
);

export default Block;
