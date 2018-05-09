import React from 'react';
import { Select, Icon } from 'antd';
import './Project.less';

const Option = Select.Option;

export default class Project extends React.Component {
  render() {
    const { projects, onSelect, theme } = this.props;
    return (
      <div className={`project-select-wrapper ${theme}`} id="project-select">
        <Select
          className="project-select"
          showSearch
          optionFilterProp="children"
          placeholder="请输入关键字查询项目"
          onSelect={onSelect}
          defaultActiveFirstOption={false}
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
            0
          }
          dropdownStyle={{ height: 96 }}
          getPopupContainer={() => document.getElementById('project-select')}
        >
          {projects.map(project => (
            <Option value={project.value} key={project.value}>
              {project.label}
            </Option>
          ))}
        </Select>
        <div className="search-icon-container">
          <Icon type="search" />
        </div>
      </div>
    );
  }
}
