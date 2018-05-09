import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';
import { initAuth, logOut } from 'actions';
import Loading from '../components/Loading';

const Fragment = React.Fragment;
const processToken = (isLogin, sucess, failure) => {
  if (Cookies.get('token') && !isLogin) {
    // 有token，但是没登录，可能是第三方跳转，需要getAuthorize
    sucess();
  } else if (!Cookies.get('token')) {
    // 没token，执行登出
    failure();
  }
  // 有token且已经登录，什么都不做
};
class LoginRoute extends React.Component {
  componentDidMount() {
    processToken(this.props.isLogin, this.props.initAuth, this.props.logOut);
  }

  componentWillReceiveProps(nextProps) {
    processToken(nextProps.isLogin, this.props.initAuth, this.props.logOut);
  }

  render() {
    return Cookies.get('token') ? (
      this.props.isLogin ? (
        <Fragment>{this.props.children}</Fragment>
      ) : (
        <Loading loading={true} />
      )
    ) : (
      <Redirect to="/login" />
    );
  }
}

const mapStateToProps = ({ user }) => ({
  isLogin: user.isLogin
});

const mapDispatchToProps = dispatch => {
  return {
    initAuth: () => dispatch(initAuth()),
    logOut: () => dispatch(logOut())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginRoute);
