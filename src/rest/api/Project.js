import { fetch } from 'lib/util';
import moment from 'moment';
import { maxSize } from 'constants/const';

const url = '/api/projekt';
export const loadProjects = async (
  params = { size: maxSize },
  mapper = i => ({ label: i.name, value: i.id })
) => {
  let json = await fetch(`${url}/project`, { method: 'GET', query: params });
  return (json.content || []).map(mapper);
};

export const loadProject = async id => {
  let project = await fetch(`${url}/project/${id}`, { method: 'GET' });
  return {
    ...project,
    valid_date: project.eDianXiuEffectiveDate,
    location: [project.province, project.city],
    showLossBadge: project.lossCreate
      ? moment(project.diagramChange).isAfter(moment(project.lossCreate))
      : false
  };
};
