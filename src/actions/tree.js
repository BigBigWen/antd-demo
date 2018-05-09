import { CHANGE_TREE_PROJECTID, CHANGE_SITE } from 'constants/actionTypes';

export const changeTreeProjectId = id => dispatch =>
  dispatch({
    type: CHANGE_TREE_PROJECTID,
    id: id
  });

export const changeTreeSiteId = id => dispatch =>
  dispatch({
    type: CHANGE_SITE,
    data: id
  });
