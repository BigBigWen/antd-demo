import React from 'react';
import './RenderendMonitors.less';

const RenderendMonitors = arr => {
  return (
    arr &&
    !!arr.length && (
      <div className="c-renderendMonitors-container">
        {arr.map(point => <div className="endMonitors-point">{point}</div>)}
      </div>
    )
  );
};

export default RenderendMonitors;
