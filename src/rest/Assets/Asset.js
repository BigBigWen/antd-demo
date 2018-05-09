import { loadSites } from '../api/Site';
import { maxSize } from 'constants/const';

export const loadTreeData = async projectId => {
  let json = await loadSites({
    projectId,
    size: maxSize
  });
  return [
    {
      key: 'site',
      title: '配电房列表',
      children: json.map(i => ({ key: `${i.id}`, title: i.name }))
    }
  ];
};
