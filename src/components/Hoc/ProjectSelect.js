import React from 'react';
import SearchDropdown from '../DropdownSelect/DropdownSelect';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { changeTreeProjectId } from 'actions';
import { loadProjects } from 'rest/api/Project';
class ProjectSelect extends React.Component {
  state = {
    projects: [{ value: 0, label: '' }]
  };
  componentDidMount() {
    this.getDefaultData();
  }
  getDefaultData = async () => {
    const { projectId, changeTreeProjectId } = this.props;
    let projects = await loadProjects();
    let first = (projects || [])[0] || {};
    let selectProjectId =
      projectId && projectId !== '0' ? projectId : first.value;

    changeTreeProjectId(selectProjectId);
    this.setState({ projects });
    this.props.changeProject(selectProjectId);
  };

  changeProject = async projectId => {
    this.props.changeTreeProjectId(projectId);
    this.props.changeProject(projectId);
  };

  render() {
    const { projectId, style } = this.props;
    const { projects } = this.state;
    return (
      <SearchDropdown
        options={[...projects]}
        changeProject={this.changeProject}
        defaultValue={projectId}
        style={style}
      />
    );
  }
}

const mapStateToProps = state => ({
  projectId: state.tree.projectId
});

const mapDispatchToProps = dispatch => {
  return {
    changeTreeProjectId: id => dispatch(changeTreeProjectId(id))
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ProjectSelect)
);
