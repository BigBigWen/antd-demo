import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

const hasAuth = (auth, authList) =>
  Array.isArray(auth)
    ? auth.every(i => new Set([...authList]).has(i))
    : authList.includes(auth);

const PrivateRoute = ({ component: Component, authList, auth, ...rest }) => (
  <Route
    {...rest}
    isExact
    render={props => {
      return hasAuth(auth, authList) ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/notAuthorized',
            state: { from: props.location }
          }}
        />
      );
    }}
  />
);

const mapStateToProps = ({ user }) => ({
  isLogin: user.isLogin,
  authList: user.authList,
  authority: user.authority
});

export default connect(mapStateToProps)(PrivateRoute);
