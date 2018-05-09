import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { LossConfigContainer } from './components';
import { loadProject } from 'rest/api/Project';
import './LossConfig.less';

class LossConfig extends React.Component {
  state = {
    project: {}
  };
  componentDidMount() {
    this.loadData(this.props.match.params.projectId);
  }
  loadData = async id => {
    let project = await loadProject(id);
    this.setState({ project });
  };
  render() {
    const { project } = this.state;
    return (
      <LossConfigContainer
        showLossBadge={project.showLossBadge}
        siteId={this.props.match.params.siteId}
        loadProject={loadProject}
        queryProps={{
          projectId: this.props.match.params.projectId,
          page: 0,
          size: 10
        }}
      />
    );
  }
}

export default withRouter(LossConfig);
