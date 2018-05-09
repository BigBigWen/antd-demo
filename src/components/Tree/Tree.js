import React from 'react';
import CustomSideMenu from '../CustomSideMenu/CustomSideMenu';

import ProjectSelect from '../Hoc/ProjectSelect';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { loadProjects } from 'rest/api/Project';
import scrollToTop from '../Hoc/scrollTop';
import './Tree.less';
const getDefaultSelectedTree = children => {
  if ((children[0] || {}).hasOwnProperty('children')) {
    return getDefaultSelectedTree(children[0].children);
  } else {
    return [`${(children[0] || {}).key || ''}`];
  }
};
class Tree extends React.Component {
  state = {
    treeData: [{ key: '', title: '', children: [] }],
    selectedKeys: []
  };

  changeProject = async projectId => {
    const { loadData } = this.props;
    const treeData = await loadData(projectId);
    const selectedKeys = getDefaultSelectedTree(treeData[0].children);
    this.changeTreeSelect({
      selectedKeys,
      treeData,
      type: treeData[0].key
    });
  };
  changeTreeSelect = keyObj => {
    this.props.onFilterChange({ [`${keyObj.type}`]: keyObj.selectedKeys });
    this.setState({ ...keyObj });
  };

  handleMultiModeChange = mode => {
    const { treeData, selectedKeys } = this.state;
    this.props.changeActiveKey({
      [treeData[0].key]: [selectedKeys[0]],
      activeKey: mode
    });
    mode === 'single' && this.setState({ selectedKeys: [selectedKeys[0]] });
  };

  render() {
    const {
      onFilterChange,
      projectId,
      enableMulti,
      changeActiveKey,
      style
    } = this.props;
    const { treeData, selectedKeys } = this.state;
    return (
      <div className="c-tree" style={style}>
        <div className="search-tree-container">
          <div className="search">
            <ProjectSelect
              changeProject={this.changeProject}
              defaultValue={projectId}
            />
          </div>
          <CustomSideMenu
            data={treeData}
            enableSubMenu={false}
            enableMulti={enableMulti}
            selectedKeys={selectedKeys}
            maxKeys="10"
            onClick={keyObj => this.changeTreeSelect(keyObj)}
            onMultiModeChange={this.handleMultiModeChange}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  projectId: state.tree.projectId
});

const mapDispatchToProps = dispatch => {
  return {};
};

export default withRouter(
  scrollToTop({ top: 0 })(connect(mapStateToProps, mapDispatchToProps)(Tree))
);
