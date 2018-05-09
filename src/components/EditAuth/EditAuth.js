import React from 'react';
import { connect } from 'react-redux';

const Fragment = React.Fragment;

const EditAuth = ({ auth, children, ...rest }) => {
  const { authList } = rest;
  return authList.includes(auth) ? <Fragment>{children}</Fragment> : null;
};

const mapStateToProps = ({ user }) => ({ authList: user.authList });
export default connect(mapStateToProps)(EditAuth);
