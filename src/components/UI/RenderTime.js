import React from 'react';

const RenderTime = text =>
  text && (
    <div>
      {text
        .split(' ')
        .filter(i => !!i)
        .map(i => <div key={i}>{i}</div>)}
    </div>
  );

export default RenderTime;
