import React from 'react';
import { Select } from 'antd';

const Option = Select.Option;

const ProjectSelect = ({ onSelect, value, projects }) => {
  return (
    <Select
      className="project"
      showSearch
      optionFilterProp="children"
      placeholder="请输入关键字查询项目"
      onSelect={onSelect}
      value={value}
      filterOption={(input, option) =>
        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {projects.map(project => (
        <Option value={project.value} key={project.value}>
          {project.label}
        </Option>
      ))}
    </Select>
  );
};

export default ProjectSelect;
