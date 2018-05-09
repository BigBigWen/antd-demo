import React, { Component } from 'react';
import moment from 'moment';
import './TicketStepVerItem.less';

const TicketStepVerItem = ({ step, ind }) => (
  <div className={`ticket-step-ver-item ${ind === 0 ? 'process' : 'finished'}`}>
    <span className="icon" />
    <div className="text-group">
      <span className="date">
        {moment(step.finishTime).format('YYYY-MM-DD HH:mm:ss')}
      </span>
      <span className="action">{step.action}</span>
      <span className="comment">{step.comment}</span>
    </div>
  </div>
);

export default TicketStepVerItem;
