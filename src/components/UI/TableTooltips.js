import React from 'react';
import { Tooltip } from 'antd';
import './TableTooltips.less';

const TableTooltips = ({ title, render, titleRender }) => {
  return (
    <Tooltip
      title={titleRender ? titleRender(title) : title}
      placement="topLeft"
    >
      {render ? (
        render(title)
      ) : (
        <span className="c-table-tooltips">{title}</span>
      )}
    </Tooltip>
  );
};

export default TableTooltips;
