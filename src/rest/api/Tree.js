import { fetch } from 'lib/util';

const base = '/api';

export const loadProjectSiteTree = async () => {
  let json = await fetch(`${base}/project-site-tree`, {
    method: 'GET'
  });
  return json.content[0].tree.map(item => {
    return {
      value: item.project.id,
      label: item.project.name,
      children: [
        ...item.sites.map(site => {
          return { value: site.id, label: site.name };
        })
      ]
    };
  });
};

export const loadProjectSiteCircuitTree = async params => {
  let json = await fetch(`${base}/tree-project-site-circuit`, {
    method: 'GET',
    query: params
  });
  return json.content[0].tree.map(item => {
    return {
      value: item.project.id,
      label: item.project.name,
      children: item.tree.map(site => {
        return {
          value: site.site.id,
          label: site.site.name,
          children: site.circuits.map(circuit => {
            return {
              label: circuit.name,
              value: circuit.id
            };
          })
        };
      })
    };
  });
};
