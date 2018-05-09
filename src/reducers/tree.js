// 树形图相关,全局存储project, site, circuit, measurement
import { CHANGE_TREE_PROJECTID, CHANGE_SITE } from '../constants/actionTypes';

const initialState = {
  projectId:
    localStorage.getItem('projectId') === 'undefined' ||
    !localStorage.getItem('projectId')
      ? null
      : localStorage.getItem('projectId'),
  siteId:
    localStorage.getItem('siteId') === 'undefined' ||
    !localStorage.getItem('siteId')
      ? null
      : localStorage.getItem('siteId')
};

export const tree = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_TREE_PROJECTID:
      localStorage.setItem('projectId', action.id);
      return {
        ...state,
        projectId: action.id
      };
    case CHANGE_SITE:
      localStorage.setItem('siteId', action.id);
      return {
        ...state,
        siteId: action.data
      };
    default:
      return state;
  }
};
