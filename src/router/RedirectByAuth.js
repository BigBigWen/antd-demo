import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  SUPER_AGENT,
  DATA_AGENT,
  NORMAL_AGENT,
  OWNER_AGENT,
  TEST_AGENT,
  UNASSIGN_AGENT,
  YARDMAN_AGENT,
  CHARGE_AGENT
} from 'constants/userType';

const RedirectByAuth = ({ ...props }) => {
  switch (props.authority - 0) {
    case SUPER_AGENT:
    case DATA_AGENT:
    case YARDMAN_AGENT:
      return <Redirect to="/overview" />;
    case CHARGE_AGENT:
    case NORMAL_AGENT:
      return <Redirect to="/personal-center" />;
    case OWNER_AGENT:
      return <Redirect to="/energy-overview" />;
    default:
      return <Redirect to="/notAuthorized" />;
  }
};

const mapStateToProps = ({ user }) => ({
  isLogin: user.isLogin,
  authList: user.authList,
  authority: user.authority
});

export default connect(mapStateToProps)(RedirectByAuth);
