import { loadProjects } from 'rest/api/Project';
import { readRecord, postRecordDisappear } from './api/Alarm';
import { generateTicket } from './api/Ticket';

export default {
  loadProjects,
  readRecord,
  postRecordDisappear,
  generateTicket
};
