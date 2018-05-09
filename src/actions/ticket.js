import { GENERATE_TICKET_COMMENT } from '../constants/actionTypes';
export const generateTicketComment = comment => dispatch =>
  dispatch({
    type: GENERATE_TICKET_COMMENT,
    comment: comment
  });
