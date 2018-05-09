import { loadProjectSiteTree } from 'rest/api/Tree';
import {
  loadInspectionPlan,
  loadInspectionPlanDetail,
  postInspectionPlan,
  putInspectionPlan,
  shutDownPlan,
  reStartPlan
} from 'rest/api/Ticket';

export default {
  loadProjectSiteTree,
  loadInspectionPlan,
  loadInspectionPlanDetail,
  postInspectionPlan,
  putInspectionPlan,
  shutDownPlan,
  reStartPlan
};
