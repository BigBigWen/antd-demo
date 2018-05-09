import { actionDict } from 'constants/ticketConfig';
export const spaceCheck = /\s*\S+/;
export const createTicketSteps = stepsTpl => histories =>
  stepsTpl.map(step => {
    let target = histories.find(i => i.state === step.key) || {};
    let assignee = target.assignee || {};
    return {
      ...step,
      description: assignee.name || ''
    };
  });

export const createTicketHistories = histories =>
  histories.map(i => {
    const assignee = i.assignee || {};
    return {
      finishTime: i.finishTime,
      comment: i.state === 'Executing' ? '' : i.comment,
      action: (assignee.name || '') + (actionDict[i.action] || '')
    };
  });
export const displayText = text =>
  text !== '' && text !== null && text !== undefined ? text : '--';
