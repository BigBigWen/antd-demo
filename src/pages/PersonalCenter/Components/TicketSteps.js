import React, { Component } from 'react';
import './TicketSteps.less';

/**
 * Ticket steps wrapper
 * @param {Array<Object<title: String, description: String, key: String>>} steps
 * @param {String} current
 * @param {Enum<'horizontal', 'vertical'>} direction
 */

const Steps = ({ steps, current, StepNode, direction = 'horizontal' }) => {
  return (
    <div className={`ticket-steps-wrapper ${direction}`}>
      {steps.map((step, ind) => (
        <StepNode
          key={ind}
          step={step}
          ind={ind}
          current={current}
          steps={steps}
        />
      ))}
    </div>
  );
};

export default Steps;
