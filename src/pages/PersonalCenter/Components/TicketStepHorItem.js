import React, { Component } from 'react';
import './TicketStepHorItem.less';

const getClassName = (ind, current) =>
  ind === current ? 'process' : ind < current ? 'finished' : 'waiting';

const TicketStepHorItem = ({ step, ind, current, steps }) => {
  const currentInd = steps.findIndex(i => i.key === current);
  return (
    <div className={`ticket-step-hor-item ${getClassName(ind, currentInd)}`}>
      <span className="text">{step.title}</span>
      <span className="icon" />
      <span className="text">{step.description}</span>
    </div>
  );
};

export default TicketStepHorItem;
