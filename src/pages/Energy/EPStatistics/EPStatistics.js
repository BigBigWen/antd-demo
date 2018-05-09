import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import './EPStatistics.less';
import EPStatisticsCom from './components/EPStatisticsCom';

class EPStatistics extends React.Component {
  render() {
    const param = {
      query: {
        groupId: this.props.groupId
      }
    };
    return <EPStatisticsCom param={param} />;
  }
}

const mapStateToProps = state => ({
  groupId: state.user.groupId
});

const mapDispatchToProps = dispatch => {
  return {};
};
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(EPStatistics)
);
